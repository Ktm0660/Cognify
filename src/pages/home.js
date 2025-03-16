import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="welcome-container">
                <div className="welcome-box">
                    <h1>Welcome to the Game Theory Learning Site</h1>
                    <button onClick={() => navigate("/game")}>Pattern Guessing Game</button>
                </div>
            </div>
        </div>
    );
}
