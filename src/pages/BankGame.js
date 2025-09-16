import React, { useEffect, useState } from "react";
import "../styles/bank.css";

const avatarOptions = [
  "🐱",
  "🐶",
  "🐻",
  "🦊",
  "🐼",
  "🦁",
  "🐸",
  "🐰",
  "🐨",
  "🐯",
];

export default function BankGame() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerConfigs, setPlayerConfigs] = useState(() =>
    Array.from({ length: 2 }, (_, i) => ({
      name: `Player ${i + 1}`,
      avatar: avatarOptions[i % avatarOptions.length],
    }))
  );
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState(0); // 0 setup, 1 first phase, 2 second phase, 3 over
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(0);
  const [dice, setDice] = useState([null, null]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPlayerConfigs((prev) =>
      Array.from({ length: numPlayers }, (_, i) => {
        if (prev[i]) {
          return prev[i];
        }
        return {
          name: `Player ${i + 1}`,
          avatar: avatarOptions[i % avatarOptions.length],
        };
      })
    );
  }, [numPlayers]);

  const updatePlayerConfig = (index, field, value) => {
    setPlayerConfigs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleNameChange = (index, value) => {
    updatePlayerConfig(index, "name", value);
  };

  const handleAvatarSelect = (index, avatar) => {
    updatePlayerConfig(index, "avatar", avatar);
  };

  const startGame = () => {
    const setupPlayers = playerConfigs.map((config, i) => ({
      name: config.name.trim() || `Player ${i + 1}`,
      avatar: config.avatar,
      score: 0,
      banked: false,
    }));
    setPlayers(setupPlayers);
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setMessage("Phase 1: each player rolls once to build the pot.");
  };

  const nextActive = (index, list = players) => {
    let next = index;
    do {
      next = (next + 1) % list.length;
    } while (list[next].banked);
    return next;
  };

  const handleRoll = () => {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    setDice([d1, d2]);

    if (phase === 1) {
      const value = d1 + d2 === 7 ? 70 : d1 + d2;
      const updatedPot = pot + value;
      setPot(updatedPot);
      const msg = `${players[currentPlayer].name} rolled ${d1} + ${d2} for ${value} points. Pot is now ${updatedPot}.`;
      setMessage(msg);
      const next = currentPlayer + 1;
      if (next >= players.length) {
        setPhase(2);
        setCurrentPlayer(0);
        setMessage("Phase 2: Roll or Bank. A 7 ends the round and doubles double the pot.");
      } else {
        setCurrentPlayer(next);
      }
    } else if (phase === 2) {
      if (d1 + d2 === 7) {
        setPot(0);
        setMessage(`${players[currentPlayer].name} rolled a 7! The pot busts and the round ends.`);
        setPhase(3);
      } else {
        let newPot = pot + d1 + d2;
        let msg = `${players[currentPlayer].name} rolled ${d1} + ${d2} = ${d1 + d2}.`;
        if (d1 === d2) {
          newPot *= 2;
          msg += " Doubles! Pot doubled.";
        }
        setPot(newPot);
        msg += ` Pot is now ${newPot}.`;
        setMessage(msg);
        const next = nextActive(currentPlayer);
        setCurrentPlayer(next);
      }
    }
  };

  const handleBank = () => {
    const updated = players.map((player, index) =>
      index === currentPlayer
        ? { ...player, score: player.score + pot, banked: true }
        : player
    );
    const bankedPlayer = updated[currentPlayer];
    setPlayers(updated);
    setPot(0);
    setMessage(`${bankedPlayer.name} banked ${pot} points!`);

    if (updated.every((p) => p.banked)) {
      setPhase(3);
      return;
    }

    const next = nextActive(currentPlayer, updated);
    setCurrentPlayer(next);
  };

  const resetGame = () => {
    setPhase(0);
    setPlayers([]);
    setPot(0);
    setDice([null, null]);
    setMessage("");
    setCurrentPlayer(0);
  };

  const leaderScore = players.length ? Math.max(...players.map((p) => p.score)) : 0;
  const leaders = leaderScore > 0 ? players.filter((p) => p.score === leaderScore) : [];
  const scoreboardRows = players
    .map((player, index) => ({ player, originalIndex: index }))
    .sort((a, b) => b.player.score - a.player.score);

  if (phase === 0) {
    return (
      <div className="bank-game">
        <h2>Bank</h2>
        <div className="bank-setup-panel">
          <label className="player-count">
            Players
            <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
              {Array.from({ length: 7 }, (_, i) => i + 2).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className="player-setup-grid">
            {playerConfigs.map((config, index) => (
              <div className="player-setup-card" key={index}>
                <div className="player-setup-header">
                  <span className="avatar-preview">{config.avatar}</span>
                  <span className="player-label">Player {index + 1}</span>
                </div>
                <label className="player-name-input">
                  Name
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                  />
                </label>
                <div className="avatar-picker">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      className={`avatar-option ${config.avatar === avatar ? "selected" : ""}`}
                      onClick={() => handleAvatarSelect(index, avatar)}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const statusMessage =
    message ||
    (phase === 1
      ? "Phase 1: each player rolls once to build the pot."
      : phase === 2
      ? "Phase 2: Decide to roll or bank. Rolling a 7 ends the round."
      : "Round complete. Review the leaderboard below.");

  const diceAvailable = dice[0] !== null && dice[1] !== null;

  return (
    <div className="bank-game">
      <h2>Bank</h2>

      <div className="bank-status-grid">
        <div className="info-card">
          <h3>{phase === 3 ? "Leaders" : "Current Player"}</h3>
          {phase === 3 ? (
            leaders.length ? (
              <ul className="leader-list">
                {leaders.map((leader, index) => (
                  <li key={`${leader.name}-${index}`}>
                    <span className="player-avatar">{leader.avatar}</span>
                    <span className="player-name">{leader.name}</span>
                    <span className="leader-score">{leader.score}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="info-placeholder">No points banked yet.</p>
            )
          ) : (
            <div className="player-callout">
              <span className="player-avatar">{players[currentPlayer].avatar}</span>
              <span className="player-name">{players[currentPlayer].name}</span>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>Round Total</h3>
          <p className="info-value">{pot}</p>
        </div>

        <div className="info-card">
          <h3>Last Roll</h3>
          {diceAvailable ? (
            <div className="dice-display">
              <span className="die">{dice[0]}</span>
              <span className="dice-symbol">+</span>
              <span className="die">{dice[1]}</span>
              <span className="dice-symbol">=</span>
              <span className="dice-total">{dice[0] + dice[1]}</span>
            </div>
          ) : (
            <p className="info-placeholder">No rolls yet.</p>
          )}
        </div>

        <div className="info-card message-card">
          <h3>Status</h3>
          <p className="message-text">{statusMessage}</p>
        </div>
      </div>

      {phase !== 3 ? (
        <div className="bank-controls">
          <button className="primary" onClick={handleRoll}>
            Roll Dice
          </button>
          {phase === 2 && (
            <button onClick={handleBank} disabled={pot === 0}>
              Bank Points
            </button>
          )}
        </div>
      ) : (
        <div className="round-summary">
          <h3>Round Complete</h3>
          {leaders.length ? (
            <p>
              {leaders.map((leader) => leader.name).join(", ")}{" "}
              {leaders.length > 1 ? "tie" : "wins"} with {leaderScore} points!
            </p>
          ) : (
            <p>No one banked points this round. Try again!</p>
          )}
        </div>
      )}

      <div className="scoreboard-section">
        <h3>Scoreboard</h3>
        <table className="score-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Player</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scoreboardRows.map(({ player, originalIndex }) => (
              <tr
                key={originalIndex}
                className={`${
                  leaderScore > 0 && player.score === leaderScore ? "leader" : ""
                } ${phase !== 3 && originalIndex === currentPlayer ? "active" : ""}`.trim()}
              >
                <td className="avatar-cell">{player.avatar}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
                <td>
                  {phase === 3
                    ? player.score === leaderScore && leaderScore > 0
                      ? "Winner"
                      : ""
                    : player.banked
                    ? "Banked"
                    : "Rolling"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {phase === 3 && (
        <div className="bank-footer-controls">
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

