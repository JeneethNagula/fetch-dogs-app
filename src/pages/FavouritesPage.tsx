import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDogDetails } from "../services/dogService";
import axios from "axios";
import { toast } from "react-toastify";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [favorites] = useState<string[]>(location.state?.favorites || []);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);

  // Fetch dog details
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) return;
      const data = await fetchDogDetails(favorites);
      setFavoriteDogs(data);
    };
    fetchFavorites();
  }, [favorites]);

  // Match API request
  const findBestMatch = async () => {
    if (favorites.length === 0) {
      toast.warning("Select some dogs to match!");
      return;
    }

    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites,
        { withCredentials: true }
      );

      const matchedDogId = response.data.match;
      const matchedDogDetails = await fetchDogDetails([matchedDogId]);

      setMatch(matchedDogDetails[0]);
      toast.success("Match found! Check below.");
    } catch (error) {
      toast.error("Failed to find a match.");
      console.error("Matching Error:", error);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">Your Favorite Dogs</h1>

      {/* Display Favorited Dogs */}
      {favoriteDogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favoriteDogs.map((dog) => (
            <div
              key={dog.id}
              className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition-all duration-300"
            >
              <img src={dog.img} alt={dog.name} className="w-full h-60 object-cover rounded-xl" />
              <div className="mt-4 text-center">
                <h3 className="font-bold text-xl">{dog.name}</h3>
                <p className="text-gray-600">Breed: {dog.breed}</p>
                <p className="text-gray-500">Age: {dog.age} years</p>
                <p className="text-gray-500">Location: {dog.zip_code}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-700">No favorite dogs selected.</p>
      )}

      {/* Match Button */}
      {favorites.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={findBestMatch}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Find My Best Match
          </button>
        </div>
      )}

      {/* Display Matched Dog */}
      {match && (
        <div className="mt-8 p-6 border rounded-xl shadow-lg bg-white max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Your Best Match!</h2>
          <img src={match.img} alt={match.name} className="w-full h-64 object-cover rounded-xl" />
          <p className="text-xl font-bold mt-4">{match.name}</p>
          <p className="text-gray-600">Breed: {match.breed}</p>
          <p className="text-gray-500 text-sm">Age: {match.age} years</p>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/search")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
        >
          Back to Search
        </button>
      </div>
    </div>
  );
}
