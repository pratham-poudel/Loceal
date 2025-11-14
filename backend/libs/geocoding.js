const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

/**
 * Geocode an address using OLA Maps API
 * Returns: coordinates + cleaned address fields
 */
const getCoordinatesFromAddress = async (addressDetails) => {
    const fullAddress = `${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state}, ${addressDetails.pincode}, India`;
    // console.log(fullAddress)
    try {
        const response = await axios.get(
            "https://api.olamaps.io/places/v1/geocode",
            {
                params: {
                    address: fullAddress,
                    language: "English",
                    api_key: process.env.OLA_MAPS_API_KEY
                },
                headers: {
                    "X-Request-Id": uuidv4(),
                    "X-Correlation-Id": uuidv4()
                }
            }
        );

        const data = response.data;
        // console.log(data);

        // No results found
        if (!data.geocodingResults || data.geocodingResults.length === 0) {
            throw new Error("No geocoding results found");
        }

        const result = data.geocodingResults[0];   // Take the most relevant result
        const loc = result.geometry.location;      // { lat, lng }
        const components = result.address_components;

        // Helper: extract fields safely
        const find = (type) =>
            components.find(c => c.types.includes(type))?.long_name;

        return {
            coordinates: [loc.lng, loc.lat],   // GeoJSON: [longitude, latitude]
            address: {
                street: find("route") || addressDetails.street,
                city: find("locality") || find("administrative_area_level_2") || addressDetails.city,
                state: find("administrative_area_level_1") || addressDetails.state,
                pincode: find("postal_code") || addressDetails.pincode,
                country: find("country") || "India",
                landmark: addressDetails.landmark || null
            }
        };
    } catch (err) {
        console.log("OLA Maps Geocoding Error:", err.message);
        throw new Error("Could not convert address to coordinates");
    }
};

module.exports = { getCoordinatesFromAddress };