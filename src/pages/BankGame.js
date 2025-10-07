import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 5;
const MIN_ROUNDS = 1;
const MAX_ROUNDS = 20;

const strategyLabels = {
  aggressive: "Aggressive",
  conservative: "Conservative",
  middle: "Middle",
  random: "Random",
  copycat: "Copycat",
};

const strategyValues = Object.keys(strategyLabels);

const playerCountOptions = Array.from(
  { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
  (_, i) => MIN_PLAYERS + i
);

const roundCountOptions = Array.from(
  { length: MAX_ROUNDS - MIN_ROUNDS + 1 },
  (_, i) => MIN_ROUNDS + i
);

const computerNamePool = [
  "Captain Byte",
  "Lucky Circuit",
  "Pixel Pirate",
  "Dice Driver",
  "Quantum Queen",
  "Synth Sailer",
  "Neon Navigator",
  "Vector Voyager",
  "Code Corsair",
  "Crypto Captain",
  "Gamma Gazer",
  "Turbo Tactician",
];

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

const createDefaultPlayerConfig = (index) => ({
  name: `Player ${index + 1}`,
  avatar: avatarOptions[index % avatarOptions.length],
  type: "human",
  strategy: "",
});

const generateComputerName = (usedNames, index) => {
  const available = computerNamePool.filter((name) => !usedNames.has(name));
  if (available.length) {
    const candidate = getRandomItem(available);
    usedNames.add(candidate);
    return candidate;
  }
  const fallback = `CPU ${index + 1}`;
  usedNames.add(fallback);
  return fallback;
};

const decideComputerAction = (player, { pot, lastAction }) => {
  const rolls = player.roundRolls ?? 0;

  if (pot <= 0) {
    return "roll";
  }

  switch (player.strategy) {
    case "aggressive":
      if (pot >= 90) {
        return "bank";
      }
      if (rolls >= 3 && pot >= 45) {
        return Math.random() < 0.4 ? "bank" : "roll";
      }
      return "roll";
    case "conservative":
      if (pot >= 25 || rolls >= 1) {
        return "bank";
      }
      return "roll";
    case "middle":
      if (pot >= 40) {
        return "bank";
      }
      if (rolls >= 2 && pot >= 20) {
        return "bank";
      }
      return "roll";
    case "copycat":
      if (!lastAction) {
        return Math.random() < 0.5 ? "roll" : "bank";
      }
      if (lastAction === "bank") {
        return "bank";
      }
      return "roll";
    case "random":
    default:
      return Math.random() < 0.5 ? "roll" : "bank";
  }
};

const formatStrategy = (value) => strategyLabels[value] || "";

export default function BankGame() {
  const [numPlayers, setNumPlayers] = useState(MIN_PLAYERS);
  const [totalRounds, setTotalRounds] = useState(5);
  const [playerConfigs, setPlayerConfigs] = useState(() =>
    Array.from({ length: MIN_PLAYERS }, (_, i) => createDefaultPlayerConfig(i))
  );
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState(0); // 0 setup, 1 first phase, 2 second phase, 3 over
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [pot, setPot] = useState(0);
  const [dice, setDice] = useState([null, null]);
  const [message, setMessage] = useState("");
  const [currentRound, setCurrentRound] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    setPlayerConfigs((prev) =>
      Array.from({ length: numPlayers }, (_, i) => {
        const existing = prev[i];
        if (existing) {
          return { ...createDefaultPlayerConfig(i), ...existing };
        }
        return createDefaultPlayerConfig(i);
      })
    );
  }, [numPlayers]);

  const updatePlayerConfig = (index, field, value) => {
    setPlayerConfigs((prev) => {
      const next = [...prev];
      const base = createDefaultPlayerConfig(index);
      const current = next[index] ? { ...next[index] } : base;
      next[index] = { ...base, ...current, [field]: value };
      return next;
    });
  };

  const handleNameChange = (index, value) => {
    updatePlayerConfig(index, "name", value);
  };

  const handleAvatarSelect = (index, avatar) => {
    updatePlayerConfig(index, "avatar", avatar);
  };

  const handleTypeChange = (index, type) => {
    setPlayerConfigs((prev) => {
      const next = [...prev];
      const base = createDefaultPlayerConfig(index);
      const current = next[index] ? { ...next[index] } : base;
      current.type = type;
      if (type === "human") {
        current.strategy = "";
      }
      next[index] = { ...base, ...current };
      return next;
    });
  };

  const handleStrategyChange = (index, strategy) => {
    updatePlayerConfig(index, "strategy", strategy);
  };

  const startGame = useCallback(() => {
    const assignedNames = new Set();
    const setupPlayers = playerConfigs.map((config, i) => {
      const isComputer = config.type === "computer";
      const trimmedName = config.name.trim();
      const name =
        trimmedName || (isComputer ? generateComputerName(assignedNames, i) : `Player ${i + 1}`);
      const strategy = isComputer
        ? config.strategy || getRandomItem(strategyValues)
        : "";
      return {
        name,
        avatar: config.avatar,
        type: isComputer ? "computer" : "human",
        strategy,
        score: 0,
        banked: false,
        roundRolls: 0,
      };
    });

    setPlayers(setupPlayers);
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setCurrentRound(1);
    setMessage("Round 1: Phase 1 - each player rolls once to build the pot.");
    setLastAction(null);
  }, [playerConfigs]);

  const nextActive = useCallback(
    (index, list = players) => {
      if (!list.length) {
        return 0;
      }
      let nextIndex = index;
      let attempts = 0;
      do {
        nextIndex = (nextIndex + 1) % list.length;
        attempts += 1;
      } while (list[nextIndex].banked && attempts <= list.length);
      return nextIndex;
    },
    [players]
  );

  const handleRoll = useCallback(() => {
    if (!players.length || phase === 0 || phase === 3) {
      return;
    }

    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);
    const total = d1 + d2;

    setDice([d1, d2]);
    setLastAction("roll");

    const roller = players[currentPlayer];

    if (phase === 1) {
      const value = total === 7 ? 70 : total;
      const updatedPot = pot + value;
      const summary = `Round ${currentRound}: ${roller.name} rolled ${d1} + ${d2} for ${value} points. Pot is now ${updatedPot}.`;

      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayer ? { ...player, roundRolls: 1 } : player
        )
      );

      setPot(updatedPot);

      const isLast = currentPlayer + 1 >= players.length;
      if (isLast) {
        setPhase(2);
        setCurrentPlayer(0);
        setMessage(
          `${summary} Phase 2 begins! Roll or bank. A 7 ends the round and rolling doubles doubles the pot.`
        );
      } else {
        const nextPlayer = (currentPlayer + 1) % players.length;
        setCurrentPlayer(nextPlayer);
        setMessage(summary);
      }
      return;
    }

    if (phase === 2) {
      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayer
            ? { ...player, roundRolls: (player.roundRolls ?? 0) + 1 }
            : player
        )
      );

      if (total === 7) {
        setPot(0);
        setMessage(`Round ${currentRound}: ${roller.name} rolled a 7! The pot busts and the round ends.`);
        setPhase(3);
      } else {
        let newPot = pot + total;
        let msg = `Round ${currentRound}: ${roller.name} rolled ${d1} + ${d2} = ${total}.`;
        if (d1 === d2) {
          newPot *= 2;
          msg += " Doubles! Pot doubled.";
        }
        msg += ` Pot is now ${newPot}.`;
        setPot(newPot);
        setMessage(msg);
        const next = nextActive(currentPlayer);
        setCurrentPlayer(next);
      }
    }
  }, [players, phase, pot, currentPlayer, currentRound, nextActive]);

  const handleBank = useCallback(() => {
    if (phase !== 2 || pot === 0) {
      return;
    }

    const potValue = pot;
    const updatedPlayers = players.map((player, index) =>
      index === currentPlayer
        ? { ...player, score: player.score + potValue, banked: true }
        : player
    );
    const banker = updatedPlayers[currentPlayer];

    setPlayers(updatedPlayers);
    setPot(0);
    setLastAction("bank");
    setMessage(`Round ${currentRound}: ${banker.name} banked ${potValue} points!`);

    if (updatedPlayers.every((p) => p.banked)) {
      setPhase(3);
    } else {
      const nextPlayer = nextActive(currentPlayer, updatedPlayers);
      setCurrentPlayer(nextPlayer);
    }
  }, [phase, pot, players, currentPlayer, currentRound, nextActive]);

  const startNextRound = useCallback(() => {
    if (currentRound >= totalRounds) {
      return;
    }

    const nextRound = currentRound + 1;
    setPlayers((prev) =>
      prev.map((player) => ({ ...player, banked: false, roundRolls: 0 }))
    );
    setPhase(1);
    setCurrentPlayer(0);
    setPot(0);
    setDice([null, null]);
    setCurrentRound(nextRound);
    setMessage(
      `Round ${nextRound}: Phase 1 - each player rolls once to build the pot.`
    );
    setLastAction(null);
  }, [currentRound, totalRounds]);

  const resetGame = useCallback(() => {
    setPhase(0);
    setPlayers([]);
    setPot(0);
    setDice([null, null]);
    setMessage("");
    setCurrentPlayer(0);
    setCurrentRound(0);
    setLastAction(null);
  }, []);

  useEffect(() => {
    if (phase === 0 || phase === 3) {
      return;
    }

    const active = players[currentPlayer];
    if (!active || active.type !== "computer" || active.banked) {
      return;
    }

    const timer = setTimeout(() => {
      if (phase === 1) {
        handleRoll();
      } else if (phase === 2) {
        const decision = decideComputerAction(active, { pot, lastAction });
        if (decision === "bank" && pot > 0) {
          handleBank();
        } else {
          handleRoll();
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [phase, players, currentPlayer, pot, lastAction, handleRoll, handleBank]);

  const describePlayerType = (player) =>
    player.type === "computer"
      ? `Computer${player.strategy ? ` · ${formatStrategy(player.strategy)}` : ""}`
      : "Human";

  const leaderScore = useMemo(
    () => (players.length ? Math.max(...players.map((p) => p.score)) : 0),
    [players]
  );

  const leaders = useMemo(
    () => (leaderScore > 0 ? players.filter((p) => p.score === leaderScore) : []),
    [leaderScore, players]
  );

  const scoreboardRows = useMemo(
    () =>
      players
        .map((player, index) => ({ player, originalIndex: index }))
        .sort((a, b) => {
          if (b.player.score !== a.player.score) {
            return b.player.score - a.player.score;
          }

          return a.player.name.localeCompare(b.player.name);
        }),
    [players]
  );

  if (phase === 0) {
    return (
      <div className="bank-game">
        <h2>Bank</h2>
        <div className="bank-setup-panel">
          <div className="setup-options">
            <label className="setup-select">
              Players
              <select value={numPlayers} onChange={(e) => setNumPlayers(Number(e.target.value))}>
                {playerCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="setup-select">
              Rounds
              <select
                value={totalRounds}
                onChange={(e) => setTotalRounds(Number(e.target.value))}
              >
                {roundCountOptions.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="player-setup-grid">
            {playerConfigs.map((config, index) => {
              const isComputer = config.type === "computer";
              return (
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
                  <label className="player-type-input">
                    Player Type
                    <select
                      value={config.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                    >
                      <option value="human">Human</option>
                      <option value="computer">Computer</option>
                    </select>
                  </label>
                  {isComputer && (
                    <label className="player-strategy-input">
                      Play Style
                      <select
                        value={config.strategy}
                        onChange={(e) => handleStrategyChange(index, e.target.value)}
                      >
                        <option value="">Auto Pick</option>
                        {strategyValues.map((value) => (
                          <option key={value} value={value}>
                            {formatStrategy(value)}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
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
              );
            })}
          </div>

          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  const diceAvailable = dice[0] !== null && dice[1] !== null;
  const activePlayer = players[currentPlayer];
  const isComputerTurn = phase !== 3 && activePlayer?.type === "computer";
  const isFinalRound = currentRound === totalRounds;

  const statusMessage =
    message ||
    (phase === 1
      ? `Round ${currentRound}: Phase 1 - each player rolls once to build the pot.`
      : phase === 2
      ? `Round ${currentRound}: Phase 2 - Decide to roll or bank. Rolling a 7 ends the round.`
      : `Round ${currentRound} complete. ${
          currentRound < totalRounds
            ? "Start the next round when you're ready."
            : "Game complete! Review the final leaderboard."
        }`);

  return (
    <div className="bank-game">
      <h2>Bank</h2>

      <div className="bank-status-grid">
        <div className="info-card">
          <h3>Round</h3>
          <div className="round-indicator">
            <span className="round-current">{currentRound}</span>
            <span className="round-total">/ {totalRounds}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>{phase === 3 ? "Leaders" : "Current Player"}</h3>
          {phase === 3 ? (
            leaders.length ? (
              <ul className="leader-list">
                {leaders.map((leader, index) => (
                  <li key={`${leader.name}-${index}`}>
                    <span className="player-avatar">{leader.avatar}</span>
                    <div className="leader-details">
                      <span className="player-name">{leader.name}</span>
                      {leader.type === "computer" && (
                        <span className="player-tag">
                          Computer · {formatStrategy(leader.strategy)}
                        </span>
                      )}
                    </div>
                    <span className="leader-score">{leader.score}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="info-placeholder">No points banked yet.</p>
            )
          ) : activePlayer ? (
            <div className="player-callout">
              <span className="player-avatar">{activePlayer.avatar}</span>
              <div className="player-identifiers">
                <span className="player-name">{activePlayer.name}</span>
                {activePlayer.type === "computer" && (
                  <span className="player-tag">
                    Computer · {formatStrategy(activePlayer.strategy)}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className="info-placeholder">Preparing players...</p>
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
          <button className="primary" onClick={handleRoll} disabled={isComputerTurn}>
            Roll Dice
          </button>
          {phase === 2 && (
            <button onClick={handleBank} disabled={pot === 0 || isComputerTurn}>
              Bank Points
            </button>
          )}
        </div>
      ) : (
        <div className="round-summary">
          <h3>{isFinalRound ? "Game Complete" : `Round ${currentRound} Complete`}</h3>
          {leaders.length ? (
            <p>
              {leaders.map((leader) => leader.name).join(", ")}{" "}
              {leaders.length > 1
                ? isFinalRound
                  ? "tie for the win"
                  : "share the lead"
                : isFinalRound
                ? "wins the game"
                : "leads"}{" "}
              with {leaderScore} points.
            </p>
          ) : (
            <p>No one has scored yet. Keep rolling!</p>
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
              <th>Type</th>
              <th>Score</th>
              <th>Rolls</th>
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
                <td className="type-cell">{describePlayerType(player)}</td>
                <td>{player.score}</td>
                <td className="rolls-cell">{player.roundRolls ?? 0}</td>
                <td className="status-cell">
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
          {currentRound < totalRounds && (
            <button className="primary" onClick={startNextRound}>
              Next Round
            </button>
          )}
          <button onClick={resetGame}>
            {currentRound < totalRounds ? "Restart" : "Play Again"}
          </button>
        </div>
      )}
    </div>
  );
}