

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CervicalRotation from "./components/Cervical_Rotation/CervicalRotation";

import Home from './components/Home/Home';
// import IntermalleolarDistance from "./components/IntermalleolarDistance/IntermalleolarDistance";
import ResultScreen from "./components/ResultScreen/ResultScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/resultscreen" element={<ResultScreen/>} />
        {/* <Route exact path="/cervical" element={<CervicalRotation />} />
        <Route exact path="/intermalleolar" element={<IntermalleolarDistance />} /> */}

      </Routes>
    </Router>
    
  );
}

export default App;