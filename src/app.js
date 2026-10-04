// const heading = React.createElement("h1", { id: "heading"}, "Hello World form React!,");
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(heading)

// import React from "react";
// import ReactDOM from "react-dom/client";

// const parent = React.createElement(
//   "div",
//   {
//     id: "parent"
//   },
//   [
//     React.createElement(
//       "h1",
//       {
//         id: "child",
//         key: "heading"
//       },
//       "test 2"
//     ),

//     React.createElement(
//       "h2",
//       {
//         id: "child2",
//         key: "subheading"
//       },
//       "test 2"
//     )
//   ]
// );

// const root = createRoot(document.getElementById("root"));
// root.render(parent);

//  const jsxHeading = (<h1 id="heading">Sanjay Here</h1>);

// const First = () => {
//     return <h2>Sanjay Writed First Component 1</h2>
// }

// const HeadingComponent = () => {
//     return <div> <First/> <h2>Sanjay Writed First Component</h2></div>
// }

//  const root = ReactDOM.createRoot(document.getElementById("root"));

//  root.render(<HeadingComponent />);
import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./components/header";
import Footer from "./components/footer";
import Body from "./components/body";
import About from "./components/About";
import Contact from "./components/Contact";
import Error from "./components/Error";
import RestaurantMenu from "./components/restaurantMenu";

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />

      <Outlet />
      <Footer />
    </>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Body />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/restaurants/:resId",
        element: <RestaurantMenu />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);
