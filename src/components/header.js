import { NavLink, useNavigate } from "react-router-dom";
import "../styles/header.css";
import { useState, useEffect } from "react";
import { auth } from "../firebase"; // make sure this is correctly imported
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false); // auto-close menu on resize to desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to home or login screen
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

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