import { createElement, render, useState } from "./didact";

const App = (props: { name: string }) => {
  console.log("render app");

  const [count, setCount] = useState(1);
  return (
    <h1
      style="color: red;"
      onClick={() => {
        setCount(() => count + 1);
      }}
    >
      {props.name}
      {count}
    </h1>
  );
};

const elem = <App name="Count: " />;

const root = document.getElementById("root");
render(elem, root);
