import React from "react";
import { Button, Container, Nav, Navbar} from "react-bootstrap";
import logo from "../assets/rslogo.png";
export default function Topbar() {
  return (
      <Navbar bg="light" data-bs-theme="light">
        <Container  className="d-flex justify-content-between sticky" style={{}}>
          <Navbar.Brand href="/home">
            <img
              src={logo}
              alt="rupeeswap"
              height="100"
              width="100"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Nav className="d-flex justify-content-start" style={{ fontFamily:'serif',fontSize:'1rem',fontWeight:'bold'}}>
            <Nav.Item >
              <Nav.Link href="/home"><Button className="btn btn-primary">Login</Button></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/features"><Button className="btn btn-secondary">Find nearby cash exchange partners</Button></Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
  );
}
