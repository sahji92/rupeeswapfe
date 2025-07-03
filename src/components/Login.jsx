import { useEffect, useState } from "react";
import { Button, Col, Form, Alert, Spinner } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { Link, useNavigate } from "react-router-dom";
import apiConnection from "../apiConnection";
import { apiEndpoints, httpMethods } from "../constants";

export default function Login() {
  const [formData, setFormData] = useState({
    phone: "",
  });
  const [countryCode, setCountryCode] = useState("in");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const getData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({ ...formData, phone: `+${value}` });
    setCountryCode(country.countryCode);
    console.log(value);
  };

  const validatePhone = () => {
    if (!formData.phone) {
      return "Please enter a phone number.";
    }
    if (countryCode !== "in" && formData.phone.length !== 13) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const validationError = validatePhone();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = await apiConnection(
        apiEndpoints.LOGIN_SEND_OTP_ENDPOINT,
        httpMethods.POST,
        formData
      );
      if (data.status === 200) {
        const { userId, message } = data.data;
        console.log("dataaaaaa", userId);
        setSuccess("Otp Sent");
        navigate("/verify-otp", { state: { userId: userId } });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to sign up. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(formData);
    }
  }, [formData]);

  return (
    <div className="d-flex flex-column justify-content-end align-items-center">
      <div className="m-3 border border-dark p-5 rounded rounded-3">
        <h2 className="text-center mb-4">Log in</h2>
        {error && (
          <Alert variant="danger" id="error-message" className="p-1">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" id="success-message">
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" as={Col} controlId="formGridPhone">
            <Form.Label>Phone Number</Form.Label>
            <PhoneInput
              country={"in"}
              value={formData.phone}
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
          <Button
            className="mb-3 w-100 login-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
          <hr />
        </Form>
        Don't have an account? <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}