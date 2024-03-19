import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import "./Navbar.css";

function Navbar({ isLoggedIn, handleLogout }) {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            AutoCar
            <i className="fab fa-typo3" />
          </Link>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/services"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Blogs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/tournaments"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Organizations
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-links"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
          {!isLoggedIn && (
            <Link to="/login">
              <Button buttonStyle="btn--outline">LOG IN</Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
