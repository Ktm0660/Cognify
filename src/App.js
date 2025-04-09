import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Game from "./pages/game";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import GetInfo from "./pages/getInfo"; // make this page!
import Header from "./components/header";
import RequireStarterInfo from "./components/requireStarterInfo";
import "./styles/styles.css";

function App() {
  return (
    <Router>
      <div className="App">
        <div>
          <Header />
        </div>
        <div className="mainContainer">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/info" element={<GetInfo />} />

            {/* Wrap protected routes */}
            <Route
              path="/"
              element={
                <RequireStarterInfo>
                  <Home />
                </RequireStarterInfo>
              }
            />
            <Route
              path="/game"
              element={
                <RequireStarterInfo>
                  <Game />
                </RequireStarterInfo>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
