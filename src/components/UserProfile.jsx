import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Table } from 'react-bootstrap';
import userDefault from '../assets/user.png';
import '../styles/userprofile.css';

const UserProfile = React.memo(() => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = state || {};

  
  const { username, phone, services, profilePicture } = user;

  return (
    <Container className="user-profile-container d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg w-full max-w-md">
        <Card.Body className="text-center">
          <img
            src={profilePicture || userDefault}
            alt="Profile"
            className="rounded-circle mb-3 mx-auto"
            style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #007bff' }}
            loading="lazy"
          />
          <h2 className="text-primary mb-2">{username || 'Unknown'}</h2>
          <p className="text-muted mb-3">
            <a
              href={`tel:${phone}`}
              className="text-primary hover:underline"
              style={{ textDecoration: 'none' }}
            >
              {phone}
            </a>
          </p>
          <div className="d-flex justify-content-center gap-3 mb-4">
            <Button
              variant="primary"
              href={`tel:${phone}`}
              className="bg-primary hover:bg-primary-dark"
            >
              Call
            </Button>
            <Button
              variant="success"
              href={`https://wa.me/${phone.replace('+', '')}?text=Hi%20${username},%20I%27m%20interested%20in%20your%20Rupeeswap%20services!`}
              target="_blank"
              className="bg-green-600 hover:bg-green-700"
            >
              WhatsApp
            </Button>
          </div>
          <h4 className="text-primary mb-3">Services</h4>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Service</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {services.upi.enabled && (
                <tr>
                  <td>UPI</td>
                  <td>{services.upi.percentage || 'N/A'}</td>
                </tr>
              )}
              {services.cash.enabled && (
                <tr>
                  <td>Cash</td>
                  <td>{services.cash.percentage || 'N/A'}</td>
                </tr>
              )}
              {!services.upi.enabled && !services.cash.enabled && (
                <tr>
                  <td colSpan="2" className="text-center">
                    No services available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
});

export default UserProfile;