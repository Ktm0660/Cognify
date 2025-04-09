// src/components/RequireStarterInfo.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Make sure this is exported
import { onAuthStateChanged } from "firebase/auth";

const RequireStarterInfo = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.completedStarterInfo) {
            navigate("/info");
          }
        } else {
          navigate("/info");
        }
      } else {
        // If not logged in, maybe redirect to login or allow access
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checking) return null; // Or a spinner

  return children;
};

export default RequireStarterInfo;
