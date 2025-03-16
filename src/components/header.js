import { NavLink } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
    return (
        <nav className="header">
            <h1 className="logo">Game Theory Central</h1>
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
            </ul>
        </nav>
    );
}
