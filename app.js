// const heading = React.createElement("h1", { id: "heading"}, "Hello World form React!,");
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(heading)


const parent = React.createElement("div", {
    id: "parent"
}, [React.createElement("h1", {
    id: "child"
}, "tesst 2"), React.createElement("h2", {
    id: "child2"
}, "tesst 2")]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(parent);