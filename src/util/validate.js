export const validateForm = (formData, countryCode) => {
    if (!formData.username) {
      return "Please enter a username.";
    }
    if (formData.username.length > 12) {
      return "Username cannot be more than 12 characters.";
    }
  
    if (!formData.phone) {
      return "Please enter a phone number.";
    }
    if (countryCode === "in" && formData.phone.length !== 12) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }
    if (!formData.location) {
        return "please select current location";
      }
    const { upi, cash } = formData.services;
    if (!upi.enabled && !cash.enabled) {
      return "Please select at least one service.";
    }
    if (upi.enabled && !upi.percentage) {
      return "Please select a percentage for UPI Exchange.";
    }
    if (cash.enabled && !cash.percentage) {
      return "Please select a percentage for Cash Change.";
    }
  
    return "";
  };
  
  export const validateLocationData = (components, latitude, longitude) => {
    const houseNumber = components.house_number || "";
    const road = components.road || "";
    const suburb = components.suburb || "";
    const city = components.city || components.town || components.village || "";
    const state = components.state || "";
    const country = components.country || "";
    const isValid = houseNumber || road || suburb || city || state || country || (latitude != null && longitude != null);
    let location = "";
    if (houseNumber && road) {
      location = `${houseNumber} ${road}, ${suburb ? suburb + ", " : ""}${city}, ${state}, ${country}`;
    } else if (road) {
      location = `${road}, ${suburb ? suburb + ", " : ""}${city}, ${state}, ${country}`;
    } else if (suburb && city) {
      location = `${suburb}, ${city}, ${state}, ${country}`;
    } else if (city) {
      location = `${city}, ${state}, ${country}`;
    } else if (state) {
      location = `${state}, ${country}`;
    } else {
      location = "Unknown location";
    }
    location = location.replace(/,\s*,/g, ",").replace(/,\s*$/, "").trim();
    return {
      isValid: isValid && location !== "Unknown location",
      location,
      latitude: latitude != null ? latitude : null,
      longitude: longitude != null ? longitude : null,
    };
  };