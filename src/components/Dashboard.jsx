import React, { useState, useEffect } from "react";
import { Container, Alert, Spinner, Table, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const data = await apiConnection(
        apiEndpoints.GET_USER_ENDPOINT,
        httpMethods.GET,
        null,
        { Authorization: `Bearer ${token}` }
      );
      console.log("API Response:", data);
      if (data.status === 200) {
        setUserData(data.data);
      } else {
        throw new Error(data.data?.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.log("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard. Please try again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [navigate]);

  // Use forEach to collect services data for table rows
  const serviceRows = [];
  if (userData?.user?.services) {
    Object.entries(userData.user.services).forEach(([key, { percentage }]) => {
      serviceRows.push(
        <tr key={key} style={{ transition: "background-color 0.2s" }}>
          <td className="text-capitalize fw-semibold">{key}</td>
          <td>{percentage}</td>
        </tr>
      );
    });
  }

  return (
    <div className="min-vh-100 bg-light">
      <Container fluid className="p-4">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <Spinner animation="border" variant="primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <Alert variant="danger" onClose={() => setError("")} dismissible className="w-75 mx-auto">
            {error}
          </Alert>
        ) : (
          <Card className="shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: "800px", animation: "fadeIn 0.5s ease-in" }}>
            <Card.Body className="text-center">
              {/* Placeholder Profile Picture */}
              <img
                src="https://via.placeholder.com/150?text=User"
                alt="Profile"
                className="rounded-circle mb-4"
                style={{ width: "150px", height: "150px", objectFit: "cover", border: "3px solid #007bff" }}
              />
              <h3 className="mb-4 text-primary">User Information</h3>
              <div className="mb-3 text-start">
                <strong>Userame<i class="fa fa-user"></i> :</strong> {userData?.user?.name || "Unknown"}
              </div>
              <div className="mb-3 text-start">
                <strong>Mobile No<i class="fa-solid fa-mobile"></i>:</strong> {userData?.user?.phone || "Unknown"}
              </div>
              <div className="mb-3 text-start">
                <strong>Location<i className="fa fa-map-marker"></i>
: </strong> {userData?.user?.location || "Unknown"}
              </div>
              {userData?.user?.services && (
                <>
                  <h4 className="mt-4 mb-3 text-primary">Services</h4>
                  <Table striped bordered hover responsive className="text-start">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th>Service</th>
                        <th>Charges</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceRows.length > 0 ? (
                        serviceRows
                      ) : (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No services available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}