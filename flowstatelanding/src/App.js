import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./landingfolder/landing";
import WhyItWorks from "./pages/WhyItWorks";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/why-it-works" element={<WhyItWorks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
