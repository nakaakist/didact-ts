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

const render = (element, parentDom) => {
  console.log(element);
  const { type, props } = element;
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

  parentDom.appendChild(dom);

  element.props.children.forEach((child) => render(child, dom));
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

const performUnitOfWork = (nextUnitOfWork) => {
  // TODO
};

const elem = <h1 style={{ color: "red" }}>hoge</h1>;

const root = document.getElementById("root");
render(elem, root);
