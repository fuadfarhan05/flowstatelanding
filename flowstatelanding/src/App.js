import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./landingfolder/landing";
import WhyItWorks from "./pages/WhyItWorks";
import Stickers from "./pages/Stickers";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/why-it-works" element={<WhyItWorks />} />
          <Route path="/stickers" element={<Stickers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
