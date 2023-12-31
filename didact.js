const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
};

const createTextElement = (text) => ({
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: text,
    children: [],
  },
});

const createDom = (fiber) => {
  const { type, props } = fiber;
  const isTextElement = type === "TEXT_ELEMENT";
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(type);

  const isProperty = (key) => key !== "children";
  Object.keys(props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = props[name];
      if (name === "style") {
        const style = props[name];
        Object.keys(style).forEach((key) => {
          dom.style[key] = style[key];
        });
      }
    });

  return dom;
};

const render = (element, parentDom) => {
  nextUnitOfWork = {
    dom: parentDom,
    props: {
      children: [element],
    },
  };
};

let nextUnitOfWork = null;

const workLoop = (deadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 現在のアイドル状態が終了するまでの時間見積もりを返す
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/IdleDeadline/timeRemaining
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

const performUnitOfWork = (fiber) => {
  console.log("fiber", fiber);
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
};

const elem = <h1 style={{ color: "red" }}>hoge</h1>;

const root = document.getElementById("root");
render(elem, root);
