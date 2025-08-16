import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const apiConnection = async (endpoint, method, payload = null, headers = {}) => {
  if (!endpoint || typeof endpoint !== 'string' || !endpoint.startsWith('/')) {
    console.error(`Invalid endpoint: ${endpoint}`);
    throw new Error(`Invalid endpoint: ${endpoint}`);
  }

  const url = `${BASE_URL}${endpoint}`;
  console.log(`Constructed URL: ${url}`); // Debug: Log the URL
  try {
    new URL(url); // Validate URL format
  } catch (err) {
    console.error(`Invalid URL: ${url}`, err);
    throw new Error(`Invalid URL: ${url}`);
  }

  try {
    return await axios({
      method,
      url,
      headers: { 'Content-Type': 'application/json', ...headers },
      data: payload
    }).then(res => {
      console.log('API Response:', res);
      console.log("in apiconnection");
      return res;
    });
  } catch (err) {
    console.error('API Error:', err);
    console.error("in apicnnction");
    throw new Error(err.response?.data?.message || `Failed to fetch from ${url}`);
  }
};

export default apiConnection;