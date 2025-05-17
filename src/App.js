import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import { ContactFooter } from "./components/ContactFooter";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import Dashboard from "./components/Dashboard";

function App() {
  
  return (
    <>
    <Topbar/>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
    <ContactFooter/>
    </>
  );
}

export default App;
