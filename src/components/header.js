import { NavLink, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase"; // make sure this is correctly imported
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [user, setUser] = useState(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenSection(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to home or login screen
      setMenuOpen(false);
      setOpenSection(null);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <nav className="header" ref={navRef}>
      <div className="header-top">
        <h1 className="logo">
          <NavLink to="/" className="logo-link">
            Game Theory Central
          </NavLink>
        </h1>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      {menuOpen && (
        <ul className="nav-links open">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
          </li>

          <li>
            <button
              className="section-btn"
              onClick={() =>
                setOpenSection(openSection === "solo" ? null : "solo")
              }
            >
              Single Player
            </button>
            {openSection === "solo" && (
              <ul className="submenu">
                <li>
                  <NavLink to="/game" onClick={() => setMenuOpen(false)}>
                    Pattern Guessing Game
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="section-btn"
              onClick={() => setOpenSection(openSection === "vs" ? null : "vs")}
            >
              Multiplayer
            </button>
            {openSection === "vs" && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/icecreamgame"
                    onClick={() => setMenuOpen(false)}
                  >
                    Ice Cream Battle
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/bootygame" onClick={() => setMenuOpen(false)}>
                    Split the Booty
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="section-btn"
              onClick={() =>
                setOpenSection(openSection === "education" ? null : "education")
              }
            >
              Education
            </button>
            {openSection === "education" && (
              <ul className="submenu">
                <li>
                  <NavLink
                    to="/learn/fallacies"
                    onClick={() => setMenuOpen(false)}
                  >
                    Intro to Logical Fallacies
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="section-btn"
              onClick={() =>
                setOpenSection(openSection === "insights" ? null : "insights")
              }
            >
              Insights
            </button>
            {openSection === "insights" && (
              <ul className="submenu">
                <li>
                  <NavLink to="/analysis" onClick={() => setMenuOpen(false)}>
                    Thinking Insights
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {!user ? (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => {
                  setMenuOpen(false);
                  setOpenSection(null);
                }}
              >
                Login
              </NavLink>
            </li>
          ) : (
            <li>
              <button onClick={handleLogout} className="nav-button">
                Logout
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
