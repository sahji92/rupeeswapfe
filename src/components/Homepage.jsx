import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import { fetchCurrentLocation } from '../util/location';
import apiConnection from '../apiConnection';
import { apiEndpoints, httpMethods } from '../constants'; // Adjust to '../index' if needed
import '../styles/homepage.css';

export default function Homepage() {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFindNearby = async () => {
    setIsFetching(true);
    setError('');
    try {
      if (!apiEndpoints?.NEARBY_USERS_ENDPOINT) {
        throw new Error('NEARBY_USERS_ENDPOINT is undefined. Check constants.js import or definition.');
      }
      console.log('apiEndpoints:', apiEndpoints); // Debug
      console.log('Calling API with endpoint:', apiEndpoints.NEARBY_USERS_ENDPOINT); // Debug
      const locationData = await fetchCurrentLocation();
      console.log('Current location:', locationData); // Debug
      const { latitude, longitude } = locationData;
      const data = await apiConnection(
        apiEndpoints.NEARBY_USERS_ENDPOINT,
        httpMethods.POST,
        { latitude, longitude, radius: 2000 }
      );
      console.log('Nearby users response:', data); // Debug
      if (data.status === 200) {
        navigate('/nearby', { state: { users: data.data.users || [], currentLocation: { latitude, longitude } } });
      } else {
        throw new Error(data.data?.message || 'Failed to fetch nearby users');
      }
    } catch (err) {
      console.error('Error fetching nearby users:', err);
      setError(err.message || 'Failed to find nearby users. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Container className="homepage-container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="text-primary mb-4">Welcome to Rupeeswap</h1>
      <p className="text-muted mb-4">Connect with nearby users for UPI and cash exchange services.</p>
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible className="w-75">
          {error}
        </Alert>
      )}
      <Button
        variant="primary"
        size="lg"
        onClick={handleFindNearby}
        disabled={isFetching}
        className="find-nearby-btn"
      >
        {isFetching ? (
          <>
            <Spinner size="sm" animation="border" className="me-2" />
            Finding Nearby...
          </>
        ) : (
          'Find Nearby'
        )}
      </Button>
    </Container>
  );
}