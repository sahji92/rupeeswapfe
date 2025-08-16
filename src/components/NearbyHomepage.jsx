import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Alert, Button } from 'react-bootstrap';
import userDefault from '../assets/user.png';
import '../styles/nearbyhomepage.css';

export default function NearbyHomepage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { users = [], currentLocation } = location.state || {};

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Distance in meters
  };

  const navigateToUserProfile = (user) => {
    navigate('/userprofile', { state: { user } });
  };

  return (
    <Container className="nearby-container py-5">
      <h2 className="text-center mb-4 text-primary">Nearby Service Providers</h2>
      {!currentLocation ? (
        <Alert variant="danger" className="w-75 mx-auto text-center">
          <Alert.Heading>Location Error</Alert.Heading>
          <p>Unable to retrieve your current location. Please try again from the homepage.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Homepage
          </Button>
        </Alert>
      ) : users.length === 0 ? (
        <Alert variant="info" className="w-75 mx-auto text-center">
          <Alert.Heading>No Nearby Users Found</Alert.Heading>
          <p>No service providers were found within 2km of your location. Try again later or sign up to connect with others!</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Homepage
          </Button>
          <Button variant="outline-primary" className="ms-2" onClick={() => navigate('/signup')}>
            Sign Up
          </Button>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {users.map((user) => (
            <Col key={user._id}>
              <Card 
                className="nearby-card shadow-sm border-0" 
                onClick={() => navigateToUserProfile(user)} // Fix: Pass user explicitly
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <img
                    src={user.profilePicture || userDefault}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover', border: '2px solid #007bff' }}
                  />
                  <h5 className="card-title">{user.username || 'Unknown'}</h5>
                  <p className="card-text text-muted">
                    Distance: {calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      user.location.coordinates[1], // latitude
                      user.location.coordinates[0] // longitude
                    )} meters
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}