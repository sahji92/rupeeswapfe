import { validateLocationData } from './validate';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCurrentLocation = async (retries = 2) => {
  if (!navigator.geolocation) {
    throw new Error("Geolocation not supported, using IP location.");
  }
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        });
        setTimeout(() => reject(new Error("Location fetch timed out.")), 25000);
      });
      const { latitude, longitude } = position.coords;
      return await fetchLocationFromCoordinates(latitude, longitude);
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
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}&language=en&pretty=1&no_annotations=1`
      );
      if (!response.ok) {
        if (response.status === 429) {
          if (attempt === retries) {
            throw new Error("Rate limit exceeded for OpenCage API.");
          }
          console.warn(`Rate limit hit, retrying after delay (attempt ${attempt})`);
          await delay(2000);
          continue;
        }
        throw new Error(`OpenCage API error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("OpenCage response:", data);
      if (!data.results || data.results.length === 0) {
        throw new Error("No location data available for these coordinates.");
      }
      const validatedData = validateLocationData(data.results[0].components, latitude, longitude);
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
    const validatedData = validateLocationData(data, data.latitude, data.longitude);
    if (!validatedData.isValid) {
      throw new Error("IP location data incomplete or invalid.");
    }
    return validatedData;
  } catch (err) {
    console.error("IP location error:", err);
    throw new Error(err.message || "Failed to fetch location.");
  }
};