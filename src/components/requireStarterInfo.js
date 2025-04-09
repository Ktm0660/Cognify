import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const RequireStarterInfo = ({ children }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Not logged in
        navigate("/login");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.completedStarterInfo) {
          setIsVerified(true);
        } else {
          navigate("/info"); // Redirect if starter info not complete
        }
      } else {
        navigate("/info"); // Redirect if no user document
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checking) return null; // optional loading spinner

  return isVerified ? children : null;
};

export default RequireStarterInfo;
