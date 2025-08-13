import { validateLocationData } from './validate';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCurrentLocation = async (retries = 2) => {
  if (!navigator.geolocation) {
    console.warn("Geolocation not supported, using IP location.");
    return fetchIPLocation();
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0,
        });
        setTimeout(() => reject(new Error("Location fetch timed out.")), 25000);
      });
      const { latitude, longitude,accuracy } = position.coords;
       console.log(`Browser coordinates: ${latitude}, ${longitude}, accuracy: ${accuracy}m`);
      const snappedCoords = await snapToRoad(latitude, longitude);
      return await fetchLocationFromCoordinates(snappedCoords.latitude,snappedCoords.longitude);
    } catch (err) {
      console.error(`Geolocation attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        return fetchIPLocation();
      }
      await delay(1000);
    }
  }
};

export const fetchLocationFromCoordinates = async (latitude, longitude, retries = 2) => {
  const apiKey = process.env.REACT_APP_MAPBOX_API_KEY;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${apiKey}&language=en`
      );
      if (!response.ok) {
        throw new Error(`Mapbox Geocoding API error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Mapbox Geocoding response:", data);
      if (!data.features || data.features.length === 0) {
        throw new Error("No location data available for these coordinates.");
      }
      const addressComponents = data.features[0].context.reduce((acc, item) => {
        const [type, name] = item.id.split('.');
        acc[type] = item.text;
        return acc;
      }, {});
      addressComponents.road = data.features[0].place_name;
      const validatedData = validateLocationData(addressComponents, latitude, longitude);
      if (validatedData.isValid) {
        return validatedData;
      }
      console.warn("Invalid location data, falling back to IP location.");
      return fetchIPLocation();
    } catch (err) {
      console.error(`Coordinate lookup attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        return fetchIPLocation();
      }
      await delay(1000);
    }
  }
};

export const fetchIPLocation = async () => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded for IP API.");
      }
      throw new Error(`IP API error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason || "IP location error.");
    }
    const snappedCoords = await snapToRoad(data.latitude, data.longitude);
    return await fetchLocationFromCoordinates(snappedCoords.latitude, snappedCoords.longitude);
  } catch (err) {
    console.error("IP location error:", err);
    throw new Error(err.message || "Failed to fetch location.");
  }
};

// Snap to road using Mapbox Map Matching API
const snapToRoad = async (latitude, longitude) => {
  const apiKey = process.env.REACT_APP_MAPBOX_API_KEY;
  if (!apiKey) {
    console.warn("Mapbox API key is undefined, returning original coordinates.");
    return { latitude, longitude };
  }

const url = `https://api.mapbox.com/mapmatching/v5/mapbox/walking/${longitude},${latitude};${longitude + 0.0001},${latitude + 0.0001}?access_token=${apiKey}&geometries=geojson&radiuses=100;100`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Map matching failed: ${response.status} ${response.statusText}`);
      return { latitude, longitude };
    }
    const data = await response.json();
    if (data.matchings && data.matchings[0]) {
      const { coordinates } = data.matchings[0].geometry;
      const [matchedLongitude, matchedLatitude] = coordinates[coordinates.length - 1];
      const distance = calculateDistance(latitude, longitude, matchedLatitude, matchedLongitude);
      console.log(`Snapped to road: (${matchedLatitude}, ${matchedLongitude}), distance: ${distance}m`);
      return { latitude: matchedLatitude, longitude: matchedLongitude };
    }
    console.warn("No valid matchings found, returning original coordinates.");
    return { latitude, longitude };
  } catch (err) {
    console.error("Map matching error:", err);
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