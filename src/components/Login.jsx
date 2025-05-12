import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="d-flex flex-column justify-content-end align-items-center">
      <div className="m-3 border border-dark p-5 rounded rounded-3">
        <Form>
          <h2>Log In</h2>
          <Form.Group className="mb-3" as={Col} controlId="formGridEmail">
            <Form.Label>Mobile No</Form.Label>
            <Form.Control
              name="phone"
              required
              type="number"
              placeholder="Enter Mobile No"
            />
          </Form.Group>
          <Button
            className=" w-100 rounded rounded-3"
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
          <hr></hr>
        </Form>
        Dont have an account?
        <Link to="/signup">
            Signup
        </Link>
      </div>
    </div>
  );
}
