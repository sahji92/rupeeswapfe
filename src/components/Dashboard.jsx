import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import apiConnection from "../apiConnection";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const data = await apiConnection(
          '/api/dashboard',
          'GET',
          null,
          { Authorization: `Bearer ${token}` }
        );

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

    fetchDashboard();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

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
          <p>User: {userData?.user?.phone} (Role: {userData?.user?.role})</p>
          <Button variant="danger" onClick={handleLogout} className="mt-3">
            Logout
          </Button>
        </div>
      )}
    </Container>
  );
}