import axios from "axios";

const API_URL = "https://frontend-take-home-service.fetch.com";

// Fetch available breeds
export const fetchBreeds = async () => {
  try {
    const response = await axios.get(`${API_URL}/dogs/breeds`, { withCredentials: true });
    return response.data; // Returns an array of breed names
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
};

// Fetch dogs based on filters and pagination
export const fetchDogs = async (params: string) => {
  try {
    const requestUrl = `${API_URL}/dogs/search?${params}`;

    const response = await axios.get(requestUrl, { withCredentials: true });

    if (!response.data || !response.data.resultIds) {
      throw new Error("Invalid response from /dogs/search");
    }

    return response.data; // Expected: { resultIds, total, next, prev }
  } catch (error:any) {
    console.error("Error fetching dogs:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch dog details using an array of dog IDs
export const fetchDogDetails = async (dogIds: string[]) => {
  try {

    const response = await axios.post(`${API_URL}/dogs`, dogIds, { withCredentials: true });

    console.log("Dog details response:", response.data); // Debugging log

    return response.data; // Returns an array of dog objects
  } catch (error) {
    console.error("Error fetching dog details:", error);
    throw error;
  }
};
