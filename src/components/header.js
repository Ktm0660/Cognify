import { NavLink } from "react-router-dom";
import "../styles/header.css";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false); // auto-close menu on resize to desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="header">
      <div className="header-top">
        <h1 className="logo">Game Theory Central</h1>
        {isMobile && (
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        )}
      </div>

      {/* Conditionally show nav links based on screen size and toggle state */}
      {(!isMobile || menuOpen) && (
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/game" className={({ isActive }) => isActive ? "active-link" : ""}>
              Pattern Guessing Game
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>
              Login
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}
