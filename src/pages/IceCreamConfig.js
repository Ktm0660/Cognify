import React, { useState } from "react";
import { useRouter } from "next/router";

export default function IceCreamConfig() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [rounds, setRounds] = useState(5); // default value
  const [difficulty, setDifficulty] = useState("Easy"); // new
  const router = useRouter();
  const avatars = ["🍦", "🧁", "🍨", "🧊"];
  const roundOptions = [1, 3, 5, 10, 20];
  const difficultyLevels = ["Easy", "Medium", "Hard"];

  return (
    <div className="icecream-config">
      <h1>🍦 Welcome to Ice Cream Battle!</h1>
      <p className="intro">Choose your avatar, number of rounds, and difficulty.</p>

      <div className="avatar-selector">
        {avatars.map((avatar, index) => (
          <button
            key={index}
            className={`avatar-btn ${selectedAvatar === avatar ? "selected" : ""}`}
            onClick={() => setSelectedAvatar(avatar)}
          >
            {avatar}
          </button>
        ))}
      </div>

      <p className="round-label">How many rounds do you want to play?</p>
      <div className="round-selector">
        {roundOptions.map((option) => (
          <button
            key={option}
            className={`round-btn ${rounds === option ? "selected" : ""}`}
            onClick={() => setRounds(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <p className="round-label">Choose Difficulty</p>
      <div className="round-selector">
        {difficultyLevels.map((level) => (
          <button
            key={level}
            className={`round-btn ${difficulty === level ? "selected" : ""}`}
            onClick={() => setDifficulty(level)}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      <button
        className="start-button"
        onClick={() => {
          if (selectedAvatar) {
            router.push({
              pathname: "/icecreamplay",
              query: {
                avatar: selectedAvatar,
                rounds: String(rounds),
                difficulty,
              },
            });
          } else {
            alert("Please select an avatar before starting!");
          }
        }}
      >
        🚀 Start the Duel!
      </button>
    </div>
  );
}
