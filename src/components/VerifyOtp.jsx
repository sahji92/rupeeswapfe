import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import apiConnection from "../apiConnection";
import { apiEndpoints, httpMethods } from "../constants";
import { data, useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const location = useLocation();

  const { userId } = location.state || {};
const formData={
    userId,otp
}

  const handleChange = (e) => {
    setOtp(e.target.value);
  };
  const submitOtp = async (e) => {
    e.preventDefault();
    console.log("hahahahha",formData);
    const data = await apiConnection(
      apiEndpoints.SIGNUP_VERIFY_OTP_ENDPOINT,
      httpMethods.POST,formData
    );
    if (data.status === 200) {
      console.log("success");
      navigate('/dashboard');
    }
  };
  return (
    <Container className="login-container">
      <Row className="d-flex justify-content-center">
        <Col lg={4} sm={6} className="border border-dark rounded rounded-3 p-5">
          <Form>
            <Form.Group className="mb-3" as={Col} controlId="formGridPhone">
              <Form.Label>Enter Otp</Form.Label>
              <Form.Control
                name="otp"
                value={otp}
                type="number"
                placeholder="Enter 4 digit Otp"
                aria-label="otp"
                onChange={(e) => handleChange(e)}
              />
            </Form.Group>
            <Button
              className="mb-3 w-100 login-btn"
              type="submit"
              onClick={(e) => submitOtp(e)}
            >
              Submit
            </Button>
            <hr></hr>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
