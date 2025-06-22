import { NavLink, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase"; // make sure this is correctly imported
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to home or login screen
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
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/#single-player" className={({ isActive }) => isActive ? "active-link" : ""}>
              Single Player
            </NavLink>
          </li>
          <li>
            <NavLink to="/#multiplayer" className={({ isActive }) => isActive ? "active-link" : ""}>
              Multiplayer
            </NavLink>
          </li>
          <li>
            <NavLink to="/#education" className={({ isActive }) => isActive ? "active-link" : ""}>
              Education
            </NavLink>
          </li>
          <li>
            <NavLink to="/#insights" className={({ isActive }) => isActive ? "active-link" : ""}>
              Insights
            </NavLink>
          </li>

          {!user ? (
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? "active-link" : ""}>
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