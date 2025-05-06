import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Topbar from "./Topbar";
import { ContactFooter } from "./ContactFooter";
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <div className="m-3 border border-dark p-5 rounded rounded-3">
        <Form>
          <h3>Log In</h3>
          <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              required
              type="email"
              placeholder="Enter email"
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
          <Button
            className="mb-3 w-100 rounded rounded-3"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
          <hr></hr>
        </Form>
        <Link to="/signup">
          <Button
            className="mt-3 w-100 rounded rounded-3"
            variant="secondary"
            type="submit"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
