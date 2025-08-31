import React, { useState } from "react";
import "../styles/bank.css";

export default function BankGame() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState(0); // 0 setup, 1 first phase, 2 second phase, 3 over
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(0);
  const [dice, setDice] = useState([null, null]);
  const [message, setMessage] = useState("");

  const startGame = () => {
    const setupPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      name: `Player ${i + 1}`,
      score: 0,
      banked: false,
    }));
    setPlayers(setupPlayers);
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setMessage("Phase 1: each player rolls once.");
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

  const resetGame = () => {
    setPhase(0);
    setPlayers([]);
    setPot(0);
    setDice([null, null]);
    setMessage("");
    setCurrentPlayer(0);
  };

  if (phase === 0) {
    return (
      <div className="bank-game">
        <h2>Bank</h2>
        <label>
          Players:
          <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
            {Array.from({ length: 7 }, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <button onClick={startGame}>Start</button>
      </div>
    );
  }

  if (phase === 3) {
    return (
      <div className="bank-game">
        <h2>Round Over</h2>
        <div className="scoreboard">
          {players.map((p, i) => (
            <p key={i}>
              {p.name}: {p.score}
            </p>
          ))}
        </div>
        <button onClick={resetGame}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="bank-game">
      <h2>Bank</h2>
      <p>Current Player: {players[currentPlayer].name}</p>
      <p>Pot: {pot}</p>
      {dice[0] && <p>Dice: {dice[0]} & {dice[1]}</p>}
      {message && <p>{message}</p>}
      {phase === 1 && <button onClick={handleRoll}>Roll</button>}
      {phase === 2 && (
        <div className="bank-controls">
          <button onClick={handleRoll}>Roll</button>
          <button onClick={handleBank} disabled={pot === 0}>
            Bank
          </button>
        </div>
      )}
      <div className="scoreboard">
        {players.map((p, i) => (
          <p key={i}>
            {p.name}: {p.score} {p.banked && phase !== 3 ? "\u2705" : ""}
          </p>
        ))}
      </div>
    </div>
  );
}

