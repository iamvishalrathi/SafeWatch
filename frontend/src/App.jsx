import 'leaflet/dist/leaflet.css';  // Make sure this is at the top
import "./App.css";


import HowTo from "./pages/HowTo";
import Home from "./pages/Home";
import Live from "./pages/Live";
import AllAlerts from "./pages/AllAlerts";
import AlertDetail from "./pages/AlertDetail";
import CameraDetail from "./pages/CameraDetail";
import Analytics from "./pages/Analytics";
import News from "./pages/News";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import APITest from "./pages/APITest";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a1a1a]">
        {/* bg-gradient-to-b from-custom-blue bg-[#541e6d] to-custom-green */}
        <Navbar />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/camera/:cameraId" element={<CameraDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/news" element={<News />} />
          <Route path="/how-to" element={<HowTo />} />
          <Route path="/api-test" element={<APITest />} />
          <Route path="/all-alerts" element={<AllAlerts />} />
          <Route path="/alert/:id" element={<AlertDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
