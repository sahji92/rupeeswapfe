import React from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import logo from "../assets/rslogo.png";
import { Link } from "react-router-dom";
export default function Topbar() {
  return (
    <Navbar
      className="d-flex justify-content-between p-2 fixed-top"
      bg="light"
      data-bs-theme="light"
    >
      <Navbar.Brand href="/">
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

      <Nav.Item>
        <Link to="/login">
          <Nav.Link href="/login">
            <button type="button" class="btn btn-primary">
              <i class="fa fa-sign-in"></i> Login
            </button>
          </Nav.Link>
        </Link>
      </Nav.Item>
    </Navbar>
  );
}
