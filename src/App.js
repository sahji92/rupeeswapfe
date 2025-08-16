import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Topbar from "./components/Topbar";
import { ContactFooter } from "./components/ContactFooter";
import Signup from "./components/Signup";
import VerifyOtp from "./components/VerifyOtp";
import LoginVerifyOtp from "./components/LoginVerifyOtp";
import Dashboard from "./components/Dashboard";
import NearbyHomepage from "./components/NearbyHomepage";
import PrivateRoute from "./components/PrivateRoute";
import UserProfile from "./components/UserProfile";

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Homepage />} />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route
          path="/verify-otp"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <VerifyOtp />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/login-verify-otp"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginVerifyOtp />}
        />
        <Route path="/nearby" element={<NearbyHomepage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      
      </Routes>
      <ContactFooter />
    </>
  );
}

export default App;