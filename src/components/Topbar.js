import React, { useState } from "react";
import { Button, Nav, Navbar, Spinner } from "react-bootstrap";
import logo from "../assets/rslogo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isHomePage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Delay navigation to show spinner
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout navigation error:", err);
      setIsLoggingOut(false);
    }
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
            height="60px"
            width="60px"
            className="d-inline-block align-top"
          />
        </Link>
      </Navbar.Brand>
      {isHomePage && (
        <Nav.Item>
          <Link to="/login">
            <Nav.Link href="/login">
              <button type="button" className="btn btn-primary">
                <i className="fa fa-sign-in"></i> Login
              </button>
            </Nav.Link>
          </Link>
        </Nav.Item>
      )}
      {isDashboard && (
        <Button
          variant="danger"
          onClick={handleLogout}
          className="mt-3"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Logging out...
            </>
          ) : (
            "Logout"
          )}
        </Button>
      )}
    </Navbar>
  );
}