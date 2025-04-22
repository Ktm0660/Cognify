import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore"; // ✅ NEW
import { db } from "../firebase"; // ✅ NEW
import "../styles/login.css";
import { auth, googleProvider } from "../firebase"; // make sure these are exported from firebase.js
import { signInWithPopup } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // or "/dashboard" if you want a post-login hub
    } catch (error) {
      console.error("Google Sign-in error:", error.message);
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
  
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
  
        const data = docSnap.data();
        if (data?.completedStarterInfo) {
          navigate("/"); // ✅ Go to home if info is already filled
        } else {
          navigate("/info"); // 📝 Go to info page if not filled
        }
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
        <button onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
        <p className="signup-redirect">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
