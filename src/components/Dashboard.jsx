import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import apiConnection from "../apiConnection";
import { apiEndpoints, httpMethods } from "../constants";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Fetch dashboard data
  const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const data = await apiConnection(
          apiEndpoints.GET_USER_ENDPOINT,
          httpMethods.GET,
          null,
          { Authorization: `Bearer ${token}` }
        );
console.log("API Response:", data); // Debug API response
        if (data.status === 200) {
          setUserData(data.data);
        } else {
          throw new Error(data.data?.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.log("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard. Please try again.");
        localStorage.removeItem('token'); // Clear token on error
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  // Logout function
  

  return (
    <Container className="mt-5">
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      ) : (
        <div>
          <h2>Welcome to the Dashboard</h2>
          <p>{userData?.message}</p>
          <p>User: {userData?.user?.name}</p>
          <p>Phone: {userData?.user?.phone || "Unknown"}</p>
        </div>
      )}
    </Container>
  );
}