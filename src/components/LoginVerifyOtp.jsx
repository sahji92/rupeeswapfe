import React, { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner, Alert } from "react-bootstrap";
import apiConnection from "../apiConnection";
import { apiEndpoints, httpMethods } from "../constants";
import { createCookie, useLocation, useNavigate } from "react-router-dom";

export default function LoginVerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const { userId } = location.state || {};
  const formData = { userId, otp };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const data = await apiConnection(
        apiEndpoints.LOGIN_VERIFY_OTP_ENDPOINT,
        httpMethods.POST,
        formData
      );
      if (data.status === 200) {
        console.log("OTP verified successfully");
       localStorage.setItem('token',data.data.token)
        navigate('/dashboard');
      } else {
        throw new Error(data.data?.message || "Unexpected response from server");
      }
    } catch (err) {
      console.log("OTP verification error:", err); // Debug log
      setError(err.response?.data?.message || err.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="login-container">
      <Row className="d-flex justify-content-center">
        <Col lg={4} sm={6} className="border border-dark rounded rounded-3 p-5">
          <h3 className="text-center mb-4">Verify OTP</h3>
          {error && <Alert variant="danger" id="error-message">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3" as={Col} controlId="formGridPhone">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                name="otp"
                value={otp}
                type="number"
                placeholder="Enter 4 digit OTP"
                aria-label="OTP"
                onChange={handleChange}
              />
            </Form.Group>
            <Button
              className="mb-3 w-100 login-btn"
              variant="primary"
              onClick={submitOtp}
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
                  Verifying OTP...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            <hr />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}