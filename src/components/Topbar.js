import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/rslogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
export default function Topbar() {
  const location = useLocation(); // Get current route

  // Show login button only if the current path is the homepage
  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <Navbar
      className="d-flex justify-content-between p-2"
      style={{ backgroundColor: "#f3f3f4", borderRadius: "1rem" }}
    >
      <Navbar.Brand>
       <Link to="/">
          <img
            src={logo}
            alt="rupeeswap"
            height="60vh"
            width="60vw"
            className="d-inline-block align-top"
          />
        </Link>
      </Navbar.Brand>
      {isHomePage && (
        <Nav.Item>
          <Link to="/login">
            <Nav.Link href="/login">
              <button type="button" class="btn btn-primary">
                <i class="fa fa-sign-in"></i> Login
              </button>
            </Nav.Link>
          </Link>
        </Nav.Item>
      )}
      {isDashboard &&(
        <Button variant="danger" onClick={handleLogout} className="mt-3">
                    Logout
                  </Button>
      )}
    </Navbar>
  );
}
