import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
export default function Login() {
  const [countryCode, setCountryCode] = useState("in");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePhoneChange = (value, country) => {
    setPhone(value);
    setCountryCode(country.countryCode);
  };
  const validatePhone = () => {
    if (!phone) {
      return "Please enter a phone number.";
    }
    if (countryCode === "in" && phone.length !== 12) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validateError = validatePhone();
    if (validateError) {
      setError(validateError);
      return;
    }
    setSuccess("Login successfull");
  };
  return (
    <div className="d-flex flex-column justify-content-end align-items-center">
      <div className="m-3 border border-dark p-5 rounded rounded-3">
      <h2 className="text-center mb-4">Log in</h2>
          {error && <Alert variant="danger" id="error-message" className="p-1">{error}</Alert>}
          {success && <Alert variant="success" id="success-message">{success}</Alert>}

        <Form onSubmit={handleSubmit}> 
          <Form.Group className="mb-3" as={Col} controlId="formGridPhone">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={handlePhoneChange}
              inputClass="form-control phone-input"
              buttonClass="phone-dropdown"
              placeholder="Enter phone number"
              inputProps={{
                name: "phone",
                required: true,
                "aria-label": "Phone number with country code",
              }}
              onlyCountries={["in"]}
              countryCodeEditable={false}
            />
          </Form.Group>
          <Button className="mb-3 w-100 login-btn" type="submit">
            Submit
          </Button>
          <hr></hr>
        </Form>
        Dont have an account?
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}
