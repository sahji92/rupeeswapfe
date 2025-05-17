import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Checkboxdropdown from "./Checkboxdropdown";
import { data, Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { useEffect, useState, useCallback } from "react";
import { Alert, Container, Row, Spinner } from "react-bootstrap";
import "react-phone-input-2/lib/bootstrap.css";
import "../styles/signup.css";
import { fetchCurrentLocation } from "../util/location";
import { validateForm } from "../util/validate";
import apiConnection from "../apiConnection";
import { apiEndpoints, httpMethods } from "../constants";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    services: {
      upi: { enabled: false, percentage: "" },
      cash: { enabled: false, percentage: "" },
    },
  });
  const [countryCode, setCountryCode] = useState("in");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate("");

  const getData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({ ...formData, phone: `+${value}` });
    setCountryCode(country.countryCode);
    console.log(value);
  };

  const handleServicesChange = useCallback((services) => {
    setFormData((prev) => ({ ...prev, services }));
  }, []);

  const handleFetchLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const locationData = await fetchCurrentLocation();
      setFormData({
        ...formData,
        location: locationData.location,
        latitude: locationData.latitude?.toString() || "",
        longitude: locationData.longitude?.toString() || "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Failed to fetch location. Please enter address manually (e.g., 123 MG Road, Mumbai)."
      );
      setFormData({
        ...formData,
        location: formData.location || "Enter address manually",
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
      });
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true); // Start spinner

    const validationError = validateForm(formData, countryCode);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false); // Stop spinner on validation error
      return;
    }

    try {
      const data = await apiConnection(
        apiEndpoints.SIGNUP_SEND_OTP_ENDPOINT,
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
        err.response.data.message || "Failed to sign up. Please try again."
      );
      setIsSubmitting(false); // Stop spinner
    } finally {
      if (!success) {
        setFormData({
          username: "",
          phone: "",
          location: "",
          latitude: "",
          longitude: "",
          services: {
            upi: { enabled: false, percentage: "" },
            cash: { enabled: false, percentage: "" },
          },
        });
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(formData);
    }
  }, [formData]);

  return (
    <Container className="login-container">
      <Row className="d-flex justify-content-center p-Row">
        <Col lg={4} sm={6} className="border border-dark rounded rounded-3 p-2">
          <h3 className="text-center mb-4">Sign Up</h3>
          {error && (
            <Alert variant="danger" id="error-message">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" id="success-message">
              {success}
            </Alert>
          )}

          <Form>
            <Form.Group className="mb-3" as={Col} controlId="formGridUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="text"
                placeholder="Enter Username"
                onChange={getData}
                value={formData.username}
                aria-label="Username"
                aria-describedby={error ? "error-message" : undefined}
              />
            </Form.Group>
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
            <Form.Group className="mb-3" as={Col} controlId="formGridLocation">
              <Form.Label>Location</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  name="location"
                  type="text"
                  placeholder="Enter address manually (e.g., 123 MG Road, Mumbai)"
                  onChange={getData}
                  value={formData.location}
                  aria-label="Location"
                  aria-describedby={error ? "error-message" : undefined}
                  className="me-2"
                />
                <Button
                  variant="outline-secondary"
                  onClick={handleFetchLocation}
                  disabled={isFetchingLocation}
                  aria-label="Fetch current location"
                  className="location-btn"
                >
                  {isFetchingLocation ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fa fa-map-marker"></i>
                  )}
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" as={Col} controlId="formGridService">
              <Form.Label>Services</Form.Label>
              <Checkboxdropdown onChange={handleServicesChange} />
            </Form.Group>
            <Button
              className="mb-3 w-100 login-btn"
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    variant="light"
                    role="status"
                    className="me-2"
                  />
                  Signing Up...
                </>
              ) : (
                "Submit"
              )}
            </Button>

            <hr />
            <p className="text-center">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
