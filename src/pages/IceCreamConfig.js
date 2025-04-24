import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IceCreamConfig() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [rounds, setRounds] = useState(5); // default value
  const navigate = useNavigate();
  const avatars = ["🍦", "🧁", "🍨", "🧊"];
  const roundOptions = [1, 3, 5, 10, 20];

  return (
    <div className="icecream-config">
      <h1>🍦 Welcome to Ice Cream Battle!</h1>
      <p className="intro">Choose your avatar and number of rounds.</p>
  
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
  
      {/* ✅ Add the Start button HERE: */}
      <button
        className="start-button"
        onClick={() => {
          if (selectedAvatar) {
            navigate("/icecreamplay", {
              state: { avatar: selectedAvatar, rounds },
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