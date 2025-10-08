import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";


export default function IceCreamPlay() {
  const router = useRouter();
  const { avatar: avatarQuery, rounds: roundsQuery, difficulty: difficultyQuery } = router.query;
  const avatar = useMemo(() => (typeof avatarQuery === "string" ? avatarQuery : "🍦"), [avatarQuery]);
  const rounds = useMemo(() => {
    if (typeof roundsQuery === "string") {
      const parsed = parseInt(roundsQuery, 10);
      return Number.isNaN(parsed) ? 5 : parsed;
    }
    return 5;
  }, [roundsQuery]);
  const totalRounds = useMemo(() => (rounds > 0 ? rounds : 1), [rounds]);
  const difficulty = useMemo(() => (typeof difficultyQuery === "string" ? difficultyQuery : "Easy"), [difficultyQuery]);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [aiTotal, setAiTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playerHistory, setPlayerHistory] = useState([]);


  function handlePlayerChoice(choice) {
    const prevHistory = playerHistory;
    const newHistory = [...prevHistory, choice];
    let ai;
  
    // 💡 EASY: Random guess
    const level = typeof difficulty === "string" ? difficulty : "Easy";
    if (level === "Easy" || level.toLowerCase() === "easy") {
      ai = Math.random() < 0.5 ? 3 : 5;

    // 💡 MEDIUM: Tit-for-tat
    } else if (level === "Medium" || level.toLowerCase() === "medium") {
      if (playerHistory.length === 0) {
        ai = 5; // start friendly
      } else {
        ai = playerHistory[playerHistory.length - 1]; // copy last move
      }

    // 💡 HARD: If player cooperates (5) consistently, AI does too. Else defect.
    } else if (level === "Hard" || level.toLowerCase() === "hard") {
      // use only the player's previous behaviour to decide
      const recent = prevHistory.slice(-3);
      const coopRate = recent.filter((c) => c === 5).length / Math.max(recent.length, 1);
      ai = coopRate >= 0.66 ? 5 : 3; // if they cooperated at least 2 out of 3, reward
    } else {
      ai = 3; // fallback
    }
  
    // Save results
    setPlayerChoice(choice);
    setAiChoice(ai);
    setPlayerHistory(newHistory);
  
    // Earnings logic
    let playerEarned = 0;
    let aiEarned = 0;
  
    if (choice === 5 && ai === 5) {
      playerEarned = 300;
      aiEarned = 300;
    } else if (choice === 3 && ai === 5) {
      playerEarned = 500;
      aiEarned = 0;
    } else if (choice === 5 && ai === 3) {
      playerEarned = 0;
      aiEarned = 500;
    } else {
      playerEarned = 100;
      aiEarned = 100;
    }
  
    setPlayerTotal((prev) => prev + playerEarned);
    setAiTotal((prev) => prev + aiEarned);
    setShowResult(true);
  }
  
  
  // 🔁 Now this is OUTSIDE
  function handleNextRound() {
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      setPlayerChoice(null);
      setAiChoice(null);
      setShowResult(false);
    } else {
      router.push({
        pathname: "/icecreamresults",
        query: {
          playerTotal: String(playerTotal),
          aiTotal: String(aiTotal),
          rounds: String(totalRounds),
        },
      });
      setPlayerHistory([]);
    }
  }
  
  return (
    <div className="icecream-play">
      <h1>🍦 Ice Cream Battle: Day {currentRound} of {totalRounds}</h1>
      <p>Your avatar: {avatar}</p>

      {showInstructions && (
        <div className="instructions-box">
          <h2>📖 The Story</h2>
          <p>
            It's the hottest day of the summer and you've arrived early at the city's most popular park, ready to make a fortune with your ice cream truck. But to your surprise, there's already another truck parked in your favorite spot.
          </p>
          <p>
            You approach and meet a new vendor in town. You both agree the park is big enough for two — as long as things stay fair. After some discussion, you both agree to set prices daily and see how it goes.
          </p>
          <p>
            If both of you charge <strong>$5</strong>, you'll split the crowd evenly and make <strong>$300</strong> each. If you charge <strong>$3</strong> while they charge <strong>$5</strong>, you'll steal all the customers and make <strong>$500</strong> — while they make nothing. But if they undercut you the same way, the roles reverse.
          </p>
          <p>
            If you both charge <strong>$3</strong>, you'll split the customers but only earn <strong>$100</strong> each. It's up to you — cooperate for steady gains, or undercut to try and win big (and risk losing it all).
          </p>
          <p><strong>What will you do?</strong></p>
          <button className="start-button" onClick={() => setShowInstructions(false)}>
            🎮 Start Day 1
          </button>
        </div>
      )}
  
        {!showInstructions && !showResult && (
          <div className="choice-buttons">
            <button onClick={() => handlePlayerChoice(3)}>$3</button>
            <button onClick={() => handlePlayerChoice(5)}>$5</button>
          </div>
        )}


        {!showInstructions && showResult && (
          <div className="result-display">
            <h2>📊 Day {currentRound} Results</h2>

            <div className="choice-row">
              <p><strong>You:</strong> {avatar} chose <span className="price">${playerChoice}</span></p>
              <p><strong>AI:</strong> 🤖 chose <span className="price">${aiChoice}</span></p>
            </div>

            <div className="earnings">
              <p>💵 You earned: <strong>
                {playerChoice === 5 && aiChoice === 5
                  ? "$300"
                  : playerChoice === 3 && aiChoice === 5
                  ? "$500"
                  : playerChoice === 5 && aiChoice === 3
                  ? "$0"
                  : "$100"}
              </strong></p>

              <p>💵 AI earned: <strong>
                {playerChoice === 5 && aiChoice === 5
                  ? "$300"
                  : playerChoice === 3 && aiChoice === 5
                  ? "$0"
                  : playerChoice === 5 && aiChoice === 3
                  ? "$500"
                  : "$100"}
              </strong></p>
            </div>

            <div className="totals">
              <p>Total Earnings:</p>
              <p><strong>You:</strong> ${playerTotal} &nbsp;&nbsp; | &nbsp;&nbsp; <strong>AI:</strong> ${aiTotal}</p>
            </div>

            <button onClick={handleNextRound} className="next-button">
              {currentRound < totalRounds ? "➡️ Next Day" : "🏁 See Final Results"}
            </button>
          </div>
        )}
    </div>
  );
}  