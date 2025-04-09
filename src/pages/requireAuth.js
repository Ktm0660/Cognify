// src/components/RequireAuth.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const RequireAuth = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        navigate("/login");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checking) return null; // Optional: add spinner

  return loggedIn ? children : null;
};

export default RequireAuth;
