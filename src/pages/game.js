import { useState, useRef, useEffect } from "react";
import stringSimilarity from "string-similarity";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase.client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Game() {
    const [ready, setReady] = useState(false);
    const [authUnavailable, setAuthUnavailable] = useState(false);
    const [auth, setAuth] = useState(null);
    const [db, setDb] = useState(null);
    useEffect(() => {
        const authInstance = getFirebaseAuth();
        const dbInstance = getFirebaseDb();
        if (!authInstance || !dbInstance) {
            setAuthUnavailable(true);
        } else {
            setAuth(authInstance);
            setDb(dbInstance);
        }
        setReady(true);
    }, []);

    const [showInstructions, setShowInstructions] = useState(true);
    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [num3, setNum3] = useState("");
    const [correctList, setCorrectList] = useState(["2, 4, 6"]);
    const [incorrectList, setIncorrectList] = useState([]);
    const [showFinalGuess, setShowFinalGuess] = useState(false);
    const [finalGuess, setFinalGuess] = useState("");
    const [guessResult, setGuessResult] = useState("");
    const [timeSpentCorrect, setTimeSpentCorrect] = useState(null);
    const [timeSpentIncorrect, setTimeSpentIncorrect] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [alreadyPlayed, setAlreadyPlayed] = useState(false); // Track if the user has already played
    const [errorMessage, setErrorMessage] = useState(""); // Track error messages
    const guessCountRef = useRef(0);

    // Check Firestore for existing results when the component mounts
    useEffect(() => {
        if (!auth || !db) return;

        const checkIfAlreadyPlayed = async () => {
            const user = auth.currentUser;
            if (user) {
                const resultRef = doc(db, "users", user.uid, "patternGuessingGame", "result");
                const resultDoc = await getDoc(resultRef);
                if (resultDoc.exists()) {
                    setAlreadyPlayed(true); // User has already played
                }
            }
        };

        checkIfAlreadyPlayed();
    }, [auth, db]);

    if (!ready) return null;

    if (authUnavailable) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md text-center space-y-4">
                    <h1 className="text-2xl font-semibold">Game</h1>
                    <p className="text-slate-600">
                        Firebase isn’t configured. Add environment variables and redeploy to enable gameplay.
                    </p>
                </div>
            </div>
        );
    }

    if (!auth || !db) return null;

    const handleStartGame = async () => {
        const user = auth.currentUser;

        if (user) {
            const resultRef = doc(db, "users", user.uid, "patternGuessingGame", "result");
            const resultDoc = await getDoc(resultRef);

            if (resultDoc.exists()) {
                setAlreadyPlayed(true); // Mark as already played
                setErrorMessage("You have already completed this game. You cannot play again.");
                return; // Prevent the game from starting
            }
        }

        console.log("Game started! ", Date.now());
        setStartTime(Date.now()); // Start the timer
        setShowInstructions(false);
        setErrorMessage(""); // Clear any previous error messages
    };

    const checkPattern = () => {
        const sequence = [Number(num1), Number(num2), Number(num3)];
        const followsPattern = sequence[0] < sequence[1] && sequence[1] < sequence[2]; // Example rule

        if (followsPattern) {
            setCorrectList([...correctList, sequence.join(", ")]);
        } else {
            setIncorrectList([...incorrectList, sequence.join(", ")]);
        }

        guessCountRef.current += 1;
        setNum1("");
        setNum2("");
        setNum3("");
    };

    const checkFinalGuess = async () => {
        if (alreadyPlayed) {
            setGuessResult("You have already completed this game. You cannot make another guess.");
            return; // Prevent further guesses
        }

        const formattedGuess = finalGuess.toLowerCase().trim();
        const updatedAnswers = [...answers, formattedGuess];
        setAnswers(updatedAnswers);

        const correctAnswers = [
            "numbers must be in increasing order",
            "each number must be larger than the last",
            "the sequence follows an increasing pattern",
            "ascending numbers",
            "each number must be greater than the one before",
            "numbers must be in ascending order",
            "numbers can't be decreasing or the same",
            "numbers can't decrease or repeat",
            "numbers must increase",
            "every number must be larger than the previous one",
            "any increasing amount",
            "increasing numbers",
            "increasing values",
            "ascending order",
            "every number is bigger than the last",
            "numbers are always increasing",
            "numbers must be sequentially increasing",
            "each number must be larger than the one before it",
            "each number must be bigger than the previous one",
            "each number must be greater than the previous one",
            "the numbers must always be increasing",
            "the numbers must follow an increasing sequence",
            "the numbers must be arranged in increasing order",
            "the numbers must be listed in ascending order",
            "numbers must go up",
            "numbers should get larger",
            "numbers must continuously increase",
            "each number must go up compared to the last",
            "the numbers must form an increasing sequence",
            "numbers must not decrease",
            "numbers cannot repeat or decrease",
            "a valid sequence must be strictly increasing",
            "strictly increasing numbers",
            "numbers must move upward in value",
            "numbers must rise in value",
            "each number must follow an upward trend",
            "the numbers must follow a growth pattern",
            "each number must be a higher value than the last",
            "the sequence must show progressive increments",
            "any set of numbers that keeps increasing",
            "numbers should progress upwards",
            "an increasing set of numbers",
            "numbers must maintain an upward trend",
            "numbers can’t stay the same or go down",
            "each number must be a step up from the last",
            "every number must be numerically greater than the one before",
            "numbers must follow a positive numerical progression",
            "each number must be strictly greater than the last",
            "the numbers must ascend in value",
            "the numbers must show continuous growth",
            "the order must reflect an increasing trend",
            "valid sequences must always trend upwards",
            "the sequence must be in a strictly upward pattern",
            "any increasing number",
            "number can't decrease or be the same",
            "numbers that go up by any amount",
        ];

        // Get best match from the list of correct answers
        const bestMatch = stringSimilarity.findBestMatch(formattedGuess, correctAnswers);
        console.log("Best match:", bestMatch.bestMatch.target, "Score:", bestMatch.bestMatch.rating);

        // If the best match score is 0.9 or higher, consider it correct
        if (bestMatch.bestMatch.rating >= 0.9) {
            const timeCorrect = Date.now() - startTime;
            setGuessResult(`✅ Correct! The pattern is an increasing sequence. (Matched: "${bestMatch.bestMatch.target}")`);
            setTimeSpentCorrect(timeCorrect); // Calculate time spent
            setGameOver(true); // Set game over state

            // 🔥 Save to Firestore
            const user = auth.currentUser;
            if (user) {
                const resultRef = doc(db, "users", user.uid, "patternGuessingGame", "result");
                await setDoc(resultRef, {
                    timeSpentCorrect: timeCorrect,
                    timeSpentIncorrect: timeSpentIncorrect,
                    completedAt: new Date(),
                    guessCount: guessCountRef.current,
                    answers: updatedAnswers,
                    correctList: correctList,
                    incorrectList: incorrectList,
                }, { merge: true });
            }
        } else {
            setGuessResult("❌ Incorrect! Try again.");
            const incorrectTime = Date.now() - startTime;
            setTimeSpentIncorrect((prev) => [...prev, incorrectTime]);
        }
    };

    if (alreadyPlayed) {
        return (
            <div className="already-played-container">
                <h2>Game Already Completed</h2>
                <p>You have already completed this game. Thank you for playing!</p>
            </div>
        );
    }

    if (showInstructions) {
        return (
            <div className="instructions-container">
                <div className="instructions-box">
                    <h2>How to Play</h2>
                    <p>I have a secret rule/pattern, and your objective is to determine it in only one try.</p>
                    <p>1) I will give you one example sequence that follows the rule: <strong>2-4-6</strong>.</p>
                    <p>2) You may propose as many other sequences of three numbers as you like. After each guess, you will be told whether it follows the rule or not. You will also see a history of all guesses, so you don’t need to memorize them.</p>
                    <p>3) Once you feel confident, you may make one final guess about the rule. Again, your goal is to determine the underlying pattern as accurately as possible.</p>
                    <button onClick={handleStartGame}>Start Game</button>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="sequences">
                <div className="correct-box">
                    <h3>✅ Follows the Pattern</h3>
                    <div className="sequence-list">
                        <ul>
                            {correctList.map((seq, index) => (
                                <li key={index} className="sequence-item">{seq}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="incorrect-box">
                    <h3>❌ Does Not Follow</h3>
                    <ul>
                        {incorrectList.map((seq, index) => <li key={index}>{seq}</li>)}
                    </ul>
                </div>
            </div>

            <div className="input-container">
                <h2>Enter a Sequence</h2>
                <div className="input-group">
                    <input type="number" placeholder="Enter first number" value={num1} onChange={(e) => setNum1(e.target.value)} />
                    <input type="number" placeholder="Enter second number" value={num2} onChange={(e) => setNum2(e.target.value)} />
                    <input type="number" placeholder="Enter third number" value={num3} onChange={(e) => setNum3(e.target.value)} />
                </div>
                <button onClick={checkPattern} disabled={!num1 || !num2 || !num3}>Submit</button>
            </div>

            {!showFinalGuess ? (
                <button className="final-btn" onClick={() => setShowFinalGuess(true)}>Ready to Make Final Guess</button>
            ) : (
                <div className="final-guess-container">
                    <h2>Make Your Final Guess</h2>
                    <input 
                        type="text" 
                        placeholder="Enter your guess" 
                        value={finalGuess} 
                        onChange={(e) => setFinalGuess(e.target.value)} 
                    />
                    <button onClick={checkFinalGuess} disabled={gameOver}>Submit Guess</button>
                    {guessResult && <p className="guess-result">{guessResult}</p>}
                </div>
            )}
        </div>
    );
}