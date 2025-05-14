import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Checkboxdropdown from "./Checkboxdropdown";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { useEffect, useState, useCallback } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import 'react-phone-input-2/lib/bootstrap.css';
import './signup.css';

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

  const getData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value, country) => {
    setFormData({ ...formData, phone: value });
    setCountryCode(country.countryCode);
  };

  const handleServicesChange = useCallback((services) => {
    setFormData((prev) => ({ ...prev, services }));
  }, []);

  const fetchCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported, falling back to IP location.");
      return fetchIPLocation();
    }
    setIsFetchingLocation(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
        setTimeout(() => reject(new Error("Location fetch timed out.")), 15000);
      });
      const { latitude, longitude } = position.coords;
      await fetchLocationFromCoordinates(latitude, longitude);
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("Failed to get precise location. Trying IP-based location...");
      await fetchIPLocation();
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const fetchLocationFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}&language=en&pretty=1&no_annotations=1`
      );
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded for OpenCage API.");
        }
        throw new Error(`OpenCage API error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("OpenCage response:", data);
      if (!data.results || data.results.length === 0) {
        throw new Error("No location data available for these coordinates.");
      }
      const result = data.results[0].components;
      const houseNumber = result.house_number || "";
      const road = result.road || "";
      const suburb = result.suburb || "";
      const city = result.city || result.town || result.village || "";
      const state = result.state || "";
      const country = result.country || "";
      let location = "";
      if (houseNumber && road) {
        location = `${houseNumber} ${road}, ${suburb ? suburb + ", " : ""}${city}, ${state}, ${country}`;
      } else if (road) {
        location = `${road}, ${suburb ? suburb + ", " : ""}${city}, ${state}, ${country}`;
      } else if (suburb && city) {
        location = `${suburb}, ${city}, ${state}, ${country}`;
      } else if (city) {
        location = `${city}, ${state}, ${country}`;
      } else if (state) {
        location = `${state}, ${country}`;
      } else {
        location = "Unknown location";
      }
      location = location.replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();
      if (location === "Unknown location") {
        console.warn("No detailed location data, falling back to IP location.");
        return fetchIPLocation();
      }
      setFormData({
        ...formData,
        location,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    } catch (err) {
      console.error("Location fetch error:", err);
      setError("Failed to fetch exact address. Trying IP-based location...");
      await fetchIPLocation();
    }
  };

  const fetchIPLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded for IP API.");
        }
        throw new Error(`IP API error! status: ${response.status}`);
      }
      const data = await response.json();
      const { latitude, longitude, city, region, country } = data;
      console.log("IP location:", { latitude, longitude, city, region, country });
      if (!latitude || !longitude || (!city && !region)) {
        throw new Error("IP location data incomplete.");
      }
      const location = city && region ? `${city}, ${region}, ${country}` : "Unknown location";
      setFormData({
        ...formData,
        location,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    } catch (err) {
      console.error("IP location error:", err);
      setError(err.message || "Failed to fetch location. Please enter address manually (e.g., 123 MG Road, Mumbai).");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.username) {
      setError("Please enter a username.");
      return;
    }
    if (formData.username.length > 12) {
      setError("Username cannot be more than 12 characters.");
      return;
    }

    if (!formData.phone) {
      setError("Please enter a phone number.");
      return;
    }
    if (countryCode === "in" && formData.phone.length !== 12) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    const { upi, cash } = formData.services;
    if (!upi.enabled && !cash.enabled) {
      setError("Please select at least one service.");
      return;
    }
    if (upi.enabled && !upi.percentage) {
      setError("Please select a percentage for UPI Exchange.");
      return;
    }
    if (cash.enabled && !cash.percentage) {
      setError("Please select a percentage for Cash Change.");
      return;
    }

    const submitData = new FormData();
    submitData.append('username', formData.username);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('latitude', formData.latitude);
    submitData.append('longitude', formData.longitude);
    submitData.append('services', JSON.stringify(formData.services));

    console.log('FormData:', Object.fromEntries(submitData));

    // Simulate API submission
    // fetch('/api/signup', { method: 'POST', body: submitData });

    setSuccess("Signup successful!");
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
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formData);
    }
  }, [formData]);

  return (
    <Container className="login-container">
      <Row className="d-flex justify-content-center p-Row">
        <Col lg={4} sm={6} className="border border-dark rounded rounded-3 p-2">
          <h3 className="text-center mb-4">Sign Up</h3>
          {error && <Alert variant="danger" id="error-message">{error}</Alert>}
          {success && <Alert variant="success" id="success-message">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
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
                  onClick={fetchCurrentLocation}
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
            <Button className="mb-3 w-100 login-btn" type="submit">
              Submit
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