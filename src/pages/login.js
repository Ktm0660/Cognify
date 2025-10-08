import React, { useEffect, useRef, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db, auth, googleProvider } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [logoActive, setLogoActive] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef(null);

  useEffect(() => {
    if (showForm && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showForm]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
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
          router.push("/");
        } else {
          router.push("/info");
        }
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  const activateLogo = () => {
    setShowForm(true);
    setLogoActive(true);
    setTimeout(() => setLogoActive(false), 200);
  };

  const handleLogoInteraction = () => {
    activateLogo();
  };

  const handleLogoKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateLogo();
    }
  };

  return (
    <div className="login-page">
      <div className="logo-area">
        <div
          className={`logo-container ${logoActive ? "logo-active" : ""}`}
          onClick={handleLogoInteraction}
          onKeyDown={handleLogoKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Open Cognify sign in"
        >
          <div className="logo-inner">
            <svg
              className="logo-element"
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradient-halo" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f472b6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#facc15" stopOpacity="1" />
                </linearGradient>
              </defs>
              <g transform="rotate(0, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#20c997" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  E
                </text>
              </g>
              <g transform="rotate(51.43, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#3b82f6" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  L
                </text>
              </g>
              <g transform="rotate(102.86, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#facc15" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  A
                </text>
              </g>
              <g transform="rotate(154.29, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#fb923c" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  R
                </text>
              </g>
              <g transform="rotate(205.72, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#a855f7" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  P
                </text>
              </g>
              <g transform="rotate(257.15, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#ec4899" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  M
                </text>
              </g>
              <g transform="rotate(308.58, 50, 50)">
                <path d="M50 50 L 60 15 C 65 5 35 5 40 15 L 50 50 Z" fill="#06b6d4" opacity="0.9" />
                <text x="50" y="25" textAnchor="middle" fontSize="6" fill="#0d1117" fontWeight="bold">
                  C
                </text>
              </g>
              <circle cx="50" cy="50" r="15" fill="silver" className="logo-core" />
              <text x="49.5" y="52" textAnchor="middle" fontSize="4.5" fill="#0d1117" fontWeight="bold">
                BECOME
              </text>
            </svg>
          </div>
        </div>
        <div className="branding">
          <h1>COGNIFY</h1>
          <p>The Core of Potential</p>
          {!showForm && <span className="click-instruction">Tap the growth engine to begin</span>}
        </div>
      </div>

      <div className={`login-form-wrapper ${showForm ? "visible" : ""}`}>
        <form onSubmit={handleLogin} className="login-form">
          <h2>Welcome back</h2>
          <p className="login-subtitle">Sign in to continue your journey.</p>
          {error && <p className="login-error">{error}</p>}
          <input
            ref={emailInputRef}
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
          <button type="submit" className="btn-primary">
            Log In
          </button>
          <button type="button" className="google-button" onClick={handleGoogleSignIn}>
            Sign in with Google
          </button>
          <p className="signup-redirect">
            Don't have an account?{" "}
            <span className="signup-link" onClick={() => router.push("/signup")}>
              Sign up here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
