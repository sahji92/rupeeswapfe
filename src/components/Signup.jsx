import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Checkboxdropdown from "./Checkboxdropdown";
export default function Signup() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div className="m-3 border border-dark p-5 rounded rounded-3">
        <Form>
          <h3>Sign Up</h3>
          <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              required
              type="username"
              placeholder="username"
            />
          </Form.Group>

          <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              required
              type="password"
              placeholder="Enter password"
            />
          </Form.Group>
          <Form.Group className="mb-3" as={Col} controlId="formGridPassword">
            <Form.Label>Repeat Password</Form.Label>
            <Form.Control
              name="password"
              required
              type="password"
              placeholder="Enter password"
            />
          </Form.Group>
          
            <Form.Group className="mb-3" as={Col} controlId="formGridService">
              <Form.Label>Services</Form.Label>
              <Checkboxdropdown />
            </Form.Group>
          

          <Button
            className="mb-3 w-100 rounded rounded-3"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
          <hr></hr>
        </Form>
      </div>
    </div>
  );
}
