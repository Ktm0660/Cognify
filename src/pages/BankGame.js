import React, { useState, useEffect } from "react";
import "../styles/bank.css";

export default function BankGame() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState(0); // 0 setup, 1 first phase, 2 second phase, 3 over
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(0);
  const [dice, setDice] = useState([null, null]);
  const [message, setMessage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [diceColor, setDiceColor] = useState("red");
  const [showInstructions, setShowInstructions] = useState(false);
  const [round, setRound] = useState(1);

  const startGame = () => {
    const setupPlayers = [
      {
        name: playerName || "You",
        score: 0,
        banked: false,
        color: diceColor,
        isCPU: false,
      },
      ...Array.from({ length: numPlayers - 1 }, (_, i) => ({
        name: `CPU ${i + 1}`,
        score: 0,
        banked: false,
        color: "gray",
        isCPU: true,
      })),
    ];
    setPlayers(setupPlayers);
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setMessage("Phase 1: each player rolls once.");
    setRound(1);
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
      setPot((p) => p + value);
      const msg = `${players[currentPlayer].name} rolled ${d1} + ${d2} for ${value} points.`;
      setMessage(msg);
      const next = currentPlayer + 1;
      if (next >= players.length) {
        setPhase(2);
        setCurrentPlayer(0);
        setMessage("Phase 2: Roll or Bank. 7 ends the round and doubles double the pot.");
      } else {
        setCurrentPlayer(next);
      }
    } else if (phase === 2) {
      if (d1 + d2 === 7) {
        setPot(0);
        setMessage(`${players[currentPlayer].name} rolled a 7! Pot busts and round ends.`);
        setPhase(3);
      } else {
        let newPot = pot + d1 + d2;
        let msg = `${players[currentPlayer].name} rolled ${d1} + ${d2} = ${d1 + d2}.`;
        if (d1 === d2) {
          newPot *= 2;
          msg += " Doubles! Pot doubled.";
        }
        setPot(newPot);
        setMessage(msg);
        const next = nextActive(currentPlayer);
        setCurrentPlayer(next);
      }
    }
  };

  const handleBank = () => {
    const updated = [...players];
    updated[currentPlayer].score += pot;
    updated[currentPlayer].banked = true;
    setPlayers(updated);
    setPot(0);
    setMessage(`${updated[currentPlayer].name} banked!`);

    if (updated.every((p) => p.banked)) {
      setPhase(3);
      return;
    }

    const next = nextActive(currentPlayer, updated);
    setCurrentPlayer(next);
  };

  const nextRound = () => {
    const reset = players.map((p) => ({ ...p, banked: false }));
    setPlayers(reset);
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setMessage("Phase 1: each player rolls once.");
    setRound((r) => r + 1);
  };

  const resetGame = () => {
    setPhase(0);
    setPlayers([]);
    setPot(0);
    setDice([null, null]);
    setMessage("");
    setCurrentPlayer(0);
    setPlayerName("");
    setRound(1);
  };

  useEffect(() => {
    const current = players[currentPlayer];
    if (!current || phase === 0 || phase === 3) return;
    if (current.isCPU) {
      const timer = setTimeout(() => {
        if (phase === 1) {
          handleRoll();
        } else {
          if (pot >= 100 || Math.random() < 0.5) {
            handleBank();
          } else {
            handleRoll();
          }
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, phase]);

  if (showInstructions) {
    return (
      <div className="bank-game instructions">
        <h2>How to Play Bank</h2>
        <ul>
          <li>Each round has two phases.</li>
          <li>Phase 1: Players roll once in order. 7 totals are worth 70 points; no banking.</li>
          <li>Phase 2: Players may roll or bank. Doubles double the pot. Rolling a 7 ends the round and the pot is lost.</li>
          <li>Banking locks in the pot for that player but removes them from the round.</li>
          <li>If a 7 is rolled before you bank, you score 0 for the round.</li>
        </ul>
        <button onClick={() => setShowInstructions(false)}>Back</button>
      </div>
    );
  }

  if (phase === 0) {
    return (
      <div className="bank-game">
        <h2>Bank</h2>
        <label>
          Name:
          <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        </label>
        <div className="player-select">
          {Array.from({ length: 6 }, (_, i) => i + 2).map((n) => (
            <div
              key={n}
              className={`player-card ${numPlayers === n ? "selected" : ""}`}
              onClick={() => setNumPlayers(n)}
            >
              {n}
            </div>
          ))}
        </div>
        <div className="color-select">
          {["red", "blue", "green", "yellow", "purple", "orange", "black"].map((c) => (
            <div
              key={c}
              className={`color-option ${diceColor === c ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setDiceColor(c)}
            />
          ))}
        </div>
        <button onClick={startGame}>Start</button>
        <button onClick={() => setShowInstructions(true)}>Instructions</button>
      </div>
    );
  }

  const leaderboard = [...players].sort((a, b) => b.score - a.score);

  if (phase === 3) {
    return (
      <div className="bank-game">
        <h2>Round Over</h2>
        <table className="leaderboard">
          <thead>
            <tr>
              <th>Player</th>
              <th>Total Score</th>
              <th>Banked</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.score}</td>
                <td>{p.banked ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={nextRound}>Next Round</button>
        <button onClick={resetGame}>Reset Game</button>
      </div>
    );
  }

  return (
    <div className="bank-game">
      <h2>Bank</h2>
      <table className="round-info">
        <thead>
          <tr>
            <th>Round</th>
            <th>Current Pot</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{round}</td>
            <td>{pot}</td>
          </tr>
        </tbody>
      </table>
      <p>Current Player: {players[currentPlayer].name}</p>
      {dice[0] && (
        <p className="dice" style={{ color: players[currentPlayer].color }}>
          {dice[0]} & {dice[1]}
        </p>
      )}
      {message && <p>{message}</p>}
      {phase === 1 && !players[currentPlayer].isCPU && (
        <button onClick={handleRoll}>Roll</button>
      )}
      {phase === 2 && !players[currentPlayer].isCPU && (
        <div className="bank-controls">
          <button onClick={handleRoll}>Roll</button>
          <button onClick={handleBank} disabled={pot === 0}>
            Bank
          </button>
        </div>
      )}
      <table className="leaderboard">
        <thead>
          <tr>
            <th>Player</th>
            <th>Total Score</th>
            <th>Banked</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.score}</td>
              <td>{p.banked ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

