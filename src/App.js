import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import { ContactFooter } from "./components/ContactFooter";
import Signup from "./components/Signup";
function App() {
  return (
    <>
    <Topbar/>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    <ContactFooter/>
    </>
  );
}

export default App;
