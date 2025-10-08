import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

function GetInfo() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [income, setIncome] = useState("");
  const [politicalParty, setPoliticalParty] = useState("");
  const [thinkingStyle, setThinkingStyle] = useState("");
  const [puzzleFrequency, setPuzzleFrequency] = useState("");
  const [analyticalAbility, setAnalyticalAbility] = useState("");
  const [decisionConfidence, setDecisionConfidence] = useState("");
  const [riskTaking, setRiskTaking] = useState("");
  const [gameTheoryFamiliarity, setGameTheoryFamiliarity] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !gender || !city || !state) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name,
        age,
        gender,
        city,
        state,
        education,
        profession,
        income,
        politicalParty,
        thinkingStyle,
        puzzleFrequency,
        analyticalAbility,
        decisionConfidence,
        riskTaking,
        gameTheoryFamiliarity,
        completedStarterInfo: true,
      }, { merge: true });

      router.push("/");
      window.location.reload(); // ✅ Forces App.js to re-check starter info and route properly
      
    } catch (err) {
      setError("Error saving info. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Tell us about yourself</h2>
        {error && <p className="login-error">{error}</p>}

        <label>Name: *</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Age: *</label>
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <label>Gender: *</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">-- Select --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <label>City: *</label>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label>State: *</label>
        <select value={state} onChange={(e) => setState(e.target.value)} required>
          <option value="">-- Select --</option>
          {/* Add state options */}
          <option value="ID">Idaho</option>
          <option value="UT">Utah</option>
          <option value="CA">California</option>
          {/* ... */}
        </select>

        <label>Education Level:</label>
        <select value={education} onChange={(e) => setEducation(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="High School">High School</option>
          <option value="Some College">Some College</option>
          <option value="Undergraduate">Undergraduate Degree</option>
          <option value="Graduate">Graduate Degree</option>
          <option value="Doctorate">Doctorate</option>
        </select>

        <label>Field of Study/Profession:</label>
        <input
          type="text"
          placeholder="e.g., Teacher, Engineer"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />

        <label>Household Income Level:</label>
        <select value={income} onChange={(e) => setIncome(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="<25k">Below $25,000</option>
          <option value="25-50k">$25,000 - $50,000</option>
          <option value="50-75k">$50,000 - $75,000</option>
          <option value="75-100k">$75,000 - $100,000</option>
          <option value="100-150k">$100,000 - $150,000</option>
          <option value=">150k">$150,000+</option>
        </select>

        <label>Political Party:</label>
        <select value={politicalParty} onChange={(e) => setPoliticalParty(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Democrat">Democrat</option>
          <option value="Republican">Republican</option>
          <option value="Independent">Independent</option>
          <option value="Libertarian">Libertarian</option>
          <option value="Other">Other</option>
        </select>

        <label>Thinking Style:</label>
        <select value={thinkingStyle} onChange={(e) => setThinkingStyle(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Analytical">Analytical</option>
          <option value="Creative">Creative</option>
          <option value="Balanced">Balanced</option>
        </select>

        <label>How often do you engage in puzzles?</label>
        <select value={puzzleFrequency} onChange={(e) => setPuzzleFrequency(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="Never">Never</option>
          <option value="Rarely">Rarely</option>
          <option value="Sometimes">Sometimes</option>
          <option value="Often">Often</option>
          <option value="Always">Always</option>
        </select>

        <label>How would you rate your analytical abilities?</label>
        <select value={analyticalAbility} onChange={(e) => setAnalyticalAbility(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Below Average</option>
          <option value="3">3 - Average</option>
          <option value="4">4 - Above Average</option>
          <option value="5">5 - Excellent</option>
        </select>

        <label>How confident are you in your decision-making?</label>
        <select value={decisionConfidence} onChange={(e) => setDecisionConfidence(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="1">1 - Not Confident</option>
          <option value="2">2 - Slightly Confident</option>
          <option value="3">3 - Neutral</option>
          <option value="4">4 - Confident</option>
          <option value="5">5 - Very Confident</option>
        </select>

        <label>How would you describe your risk-taking behavior?</label>
        <select value={riskTaking} onChange={(e) => setRiskTaking(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="1">1 - Very Risk-Averse</option>
          <option value="2">2 - Somewhat Risk-Averse</option>
          <option value="3">3 - Neutral</option>
          <option value="4">4 - Somewhat Risk-Taking</option>
          <option value="5">5 - Very Risk-Taking</option>
        </select>

        <label>How familiar are you with game theory?</label>
        <select value={gameTheoryFamiliarity} onChange={(e) => setGameTheoryFamiliarity(e.target.value)}>
          <option value="">-- Select --</option>
          <option value="1">1 - Not familiar</option>
          <option value="2">2 - Slightly familiar</option>
          <option value="3">3 - Somewhat familiar</option>
          <option value="4">4 - Very familiar</option>
          <option value="5">5 - Expert</option>
        </select>

        <button type="submit">Submit Info</button>
      </form>
    </div>
  );
}

export default GetInfo;
