// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";
import Home from "./pages/home";
import Game from "./pages/game";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import GetInfo from "./pages/getInfo";
import Header from "./components/header";
import "./styles/styles.css";
import IceCreamConfig from "./pages/IceCreamConfig"; // adjust if your file is elsewhere
import IceCreamPlay from "./pages/IceCreamPlay";
import IceCreamResults from "./pages/IceCreamResults";
import BootyGame from "./pages/BootyGame";
import BankGame from "./pages/BankGame";



function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasInfo, setHasInfo] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(docRef);
        setHasInfo(snap.exists() && snap.data().completedStarterInfo);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // optional spinner

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="mainContainer">
        <Routes>
  {/* Public */}
  <Route path="/login" element={user ? <Navigate to={hasInfo ? "/" : "/info"} /> : <Login />} />
  <Route path="/signup" element={user ? <Navigate to={hasInfo ? "/" : "/info"} /> : <SignUp />} />

  {/* Require login only */}
  <Route path="/info" element={!user ? <Navigate to="/login" /> : <GetInfo />} />

  {/* Require login and info */}
  <Route path="/" element={user && hasInfo ? <Home /> : <Navigate to={user ? "/info" : "/login"} />} />
  <Route path="/game" element={user && hasInfo ? <Game /> : <Navigate to={user ? "/info" : "/login"} />} />

  {/* ✅ Moved here */}
  <Route
    path="/icecreamgame"
    element={user && hasInfo ? <IceCreamConfig /> : <Navigate to={user ? "/info" : "/login"} />}
  />

<Route
  path="/icecreamplay"
  element={user && hasInfo ? <IceCreamPlay /> : <Navigate to={user ? "/info" : "/login"} />}
/>

<Route
  path="/icecreamresults"
  element={user && hasInfo ? <IceCreamResults /> : <Navigate to={user ? "/info" : "/login"} />}
/>

<Route
  path="/bootygame"
  element={user && hasInfo ? <BootyGame /> : <Navigate to={user ? "/info" : "/login"} />}
/>

<Route
  path="/bankgame"
  element={user && hasInfo ? <BankGame /> : <Navigate to={user ? "/info" : "/login"} />}
/>

</Routes>


        </div>
      </div>
    </Router>
  );
}

export default App;
