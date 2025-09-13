import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../authContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const linkClass = ({ isActive }) =>
    `nav-link text-white ${isActive ? "fw-bold" : ""}`;

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "linear-gradient(135deg, #6dd5ed, #2193b0)",
        padding: "10px 20px",
      }}
    >
      <Link className="navbar-brand text-white fw-bold" to="/">
        Erino Lead Management System
      </Link>
      <h4>Kindly please Refresh After you Login.</h4>
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarNav"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              <li className="nav-item mx-2">
                <NavLink className={linkClass} to="/leads">
                  Leads
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink className={linkClass} to="/leads/create">
                  Create Lead
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink className={linkClass} to="/profile">
                  Profile
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item mx-2">
                <NavLink className={linkClass} to="/register">
                  Register
                </NavLink>
              </li>
              <li className="nav-item mx-2">
                <NavLink className={linkClass} to="/login">
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
