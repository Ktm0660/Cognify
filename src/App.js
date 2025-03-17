import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Game from "./pages/game";
import "./styles/styles.css";
import Header from "./components/header";

function App() {
    return (
        <Router>
            <div className="App">
              <div class="top-tab">
              <Header />
             </div>
              <div className="mainContainer">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
