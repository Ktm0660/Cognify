import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const games = [
    {
      id: "pattern",
      title: "Pattern Guessing Game",
      description: "Test your logic with sequences and uncover hidden rules.",
      route: "/game",
      status: "live",
      category: "solo"
    },
    {
      id: "bias",
      title: "Bias Detection",
      description: "Spot real-world cognitive biases as they happen.",
      route: "/bias",
      status: "coming",
      category: "solo"
    },
    {
      id: "logic",
      title: "Logic Lab",
      description: "Work through logic puzzles and strengthen reasoning.",
      route: "/logic",
      status: "coming",
      category: "solo"
    },
    {
      id: "debate",
      title: "Debate the Bot",
      description: "Defend your position against an AI in real-time.",
      route: "/debate",
      status: "coming",
      category: "vs-computer"
    },
    {
      id: "logic101",
      title: "Intro to Logical Fallacies",
      description: "Learn how flawed arguments are formed and detected.",
      route: "/learn/fallacies",
      status: "coming",
      category: "education"
    },
    {
      id: "analysis",
      title: "Thinking Insights",
      description: "Explore aggregated thinking trends across all games.",
      route: "/analysis",
      status: "coming",
      category: "data"
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>🧠 Game Theory Central</h1>
        {user && (
          <p className="welcome">
            Welcome, {user.displayName || "Thinker"}!
          </p>
        )}
        <p className="subtext">
          Choose a section below to sharpen your mind and explore data.
        </p>
      </div>

      {/* Solo Games */}
      <div className="section solo">
        <h2>🧩 Solo Games</h2>
        <div className="game-grid">
          {games
            .filter((g) => g.category === "solo" && g.status === "live")
            .map((game) => (
              <div
                key={game.id}
                className="game-card"
                onClick={() => navigate(game.route)}
              >
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Challenge the Computer */}
      <div className="section vs-computer">
        <h2>🤖 Challenge the Computer</h2>
        <div className="game-grid">
          {games
            .filter((g) => g.category === "vs-computer" && g.status === "live")
            .map((game) => (
              <div
                key={game.id}
                className="game-card"
                onClick={() => navigate(game.route)}
              >
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Learn & Train */}
      <div className="section education">
        <h2>📚 Learn & Train</h2>
        <div className="game-grid">
          {games
            .filter((g) => g.category === "education" && g.status === "live")
            .map((game) => (
              <div
                key={game.id}
                className="game-card"
                onClick={() => navigate(game.route)}
              >
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Thinking Insights */}
      <div className="section data">
        <h2>📊 Thinking Insights</h2>
        <div className="game-grid">
          {games
            .filter((g) => g.category === "data" && g.status === "live")
            .map((game) => (
              <div
                key={game.id}
                className="game-card"
                onClick={() => navigate(game.route)}
              >
                <h3>{game.title}</h3>
                <p>{game.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
