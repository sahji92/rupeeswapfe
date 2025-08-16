import { validateLocationData } from './validate';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCurrentLocation = async (retries = 2) => {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported, using Google Maps Geolocation API.");
    return fetchGoogleGeolocation();
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 40000,
          maximumAge: 0,
        });
        setTimeout(() => reject(new Error("Location fetch timed out.")), 25000);
      });
      let { latitude, longitude, accuracy } = position.coords;
      latitude-=0.0811234
      longitude-=0.1191234
      console.log(`Browser coordinates: ${latitude}, ${longitude}, accuracy: ${accuracy}m`);
      const snappedCoords = await snapToRoad(latitude, longitude);
      return await fetchLocationFromCoordinates(snappedCoords.latitude, snappedCoords.longitude);
    } catch (err) {
      console.error(`Geolocation attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        console.warn("Geolocation failed, falling back to Google Maps Geolocation API.");
        return fetchGoogleGeolocation();
      }
      await delay(1000);
    }
  }
};

export const fetchLocationFromCoordinates = async (latitude, longitude, retries = 2) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=en`
      );
      if (!response.ok) {
        throw new Error(`Google Geocoding API error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Google Geocoding response:", data);
      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        throw new Error("No location data available for these coordinates.");
      }
      const addressComponents = data.results[0].address_components.reduce((acc, item) => {
        const type = item.types[0];
        acc[type] = item.long_name;
        return acc;
      }, {});
      addressComponents.road = data.results[0].formatted_address;
      const validatedData = validateLocationData(addressComponents, latitude, longitude);
      if (validatedData.isValid) {
        return validatedData;
      }
      console.warn("Invalid location data, falling back to Google Geolocation API.");
      return fetchGoogleGeolocation();
    } catch (err) {
      console.error(`Coordinate lookup attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        console.warn("Geolocation failed, falling back to Google Geolocation API.");
        return fetchGoogleGeolocation();
      }
      await delay(1000);
    }
  }
};

export const fetchGoogleGeolocation = async () => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error("Google Maps API key is undefined.");
    }
    const response = await fetch(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          considerIp: true,
        }),
      }
    );
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded for Google Geolocation API.");
      }
      throw new Error(`Google Geolocation API error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "Google Geolocation error.");
    }
    console.log(`Google Geolocation coords: ${data.location.lat}, ${data.location.lng}, accuracy: ${data.accuracy}m`);
    const snappedCoords = await snapToRoad(data.location.lat, data.location.lng);
    return await fetchLocationFromCoordinates(snappedCoords.latitude, snappedCoords.longitude);
  } catch (err) {
    console.error("Google Geolocation error:", err);
    throw new Error(err.message || "Failed to fetch location.");
  }
};

const snapToRoad = async (latitude, longitude) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("Google Maps API key is undefined, returning original coordinates.");
    return { latitude, longitude };
  }

  const url = `https://roads.googleapis.com/v1/snapToRoads?path=${latitude},${longitude}&key=${apiKey}&interpolate=false`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Roads API failed: ${response.status} ${response.statusText}`);
      return { latitude, longitude };
    }
    const data = await response.json();
    if (data.snappedPoints && data.snappedPoints[0]) {
      const { location } = data.snappedPoints[0];
      const matchedLatitude = location.latitude;
      const matchedLongitude = location.longitude;
      const distance = calculateDistance(latitude, longitude, matchedLatitude, matchedLongitude);
      console.log(`Snapped to road: (${matchedLatitude}, ${matchedLongitude}), distance: ${distance}m`);
      return { latitude: matchedLatitude, longitude: matchedLongitude };
    }
    console.warn("No valid snapped points found, returning original coordinates.");
    return { latitude, longitude };
  } catch (err) {
    console.error("Roads API error:", err);
    return { latitude, longitude };
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};