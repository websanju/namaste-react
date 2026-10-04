import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [btnName, setBtnName] = useState("login");

  return (
    <header className="header">
      <div className="logo">Foodly</div>

      <div className="location">📍 Patan, Gujarat</div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/">Offers</Link>
        <Link to="/contact">Contact</Link>
        <a
          href="#"
          onClick={() => {
            btnName === "login" ? setBtnName("logout") : setBtnName("login");
          }}
        >
          {btnName}
        </a>
        <a href="/">🛒 Cart</a>
      </nav>
    </header>
  );
};

export default Header;
