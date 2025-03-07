import { useState, useEffect } from "react";
import { fetchDogs, fetchBreeds, fetchDogDetails } from "../services/dogService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

export default function SearchPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("All");
  const [sort, setSort] = useState<string>("breed:asc");
  const [loading, setLoading] = useState<boolean>(false);
  const [nextPageCursor, setNextPageCursor] = useState<string | null>(null);
  const [prevPageCursor, setPrevPageCursor] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]); // Store favorited dog IDs


  // Fetch available breeds for dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const breedList = await fetchBreeds();
        setBreeds(["All", ...breedList]);
      } catch (error) {
        toast.error("Failed to fetch breeds.");
      }
    };
    fetchData();
  }, []);

  // Fetch dogs based on filter & sorting
  const loadDogs = async (cursor: string | null = null) => {
    setLoading(true);
    
   
    let queryParams = `sort=${sort}&size=9`;
    if (selectedBreed !== "All") {
      queryParams += `&breeds=${selectedBreed}`;
    }
  
    if (cursor) {
      const extractedCursor = cursor.split("from=")[1] || cursor;
      queryParams += `&from=${extractedCursor}`;
    }
  
    console.log("Fetching dogs query:", queryParams);
  
    try {
      const data = await fetchDogs(queryParams);

      if (!data.resultIds || data.resultIds.length === 0) {
        toast.warning("No dogs found. Please try a different filter.");
        setDogs([]);
        return;
      }
  
      // Fetch detailed dog data
      const detailedDogs = await fetchDogDetails(data.resultIds);
      setDogs(detailedDogs);
  
      // Store pagination cursors
      setNextPageCursor(data.next ? data.next.split("from=")[1] : null);
      setPrevPageCursor(data.prev ? data.prev.split("from=")[1] : null);
  
    } catch (error) {
      toast.error("Failed to fetch dogs. Please try again.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch initial dog data on page load
  useEffect(() => {
    loadDogs(); // First page
  }, [selectedBreed, sort]);

  // Toggle favorite
  const toggleFavorite = (dogId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dogId) ? prevFavorites.filter((id) => id !== dogId) : [...prevFavorites, dogId]
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">Welcome, {user?.name}!</h1>
        {/* View Favorites Button */}
       <button onClick={() => navigate("/favorites", { state: { favorites } })} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        View Favorites ({favorites.length})
      </button>
      </div>

       

      {/* Filters */}
      <div className="my-4 flex gap-4">
        {/* Breed Filter */}
        <div>
          <label htmlFor="breed">Filter by Breed:</label>
          <select
            id="breed"
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            {breeds.map((breed, index) => (
              <option key={index} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}
        <div>
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="breed:asc">Breed (A-Z)</option>
            <option value="breed:desc">Breed (Z-A)</option>
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="age:asc">Age (Youngest First)</option>
            <option value="age:desc">Age (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Dog List */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {loading ? (
    <p className="text-center col-span-2 md:col-span-3 text-lg font-semibold text-gray-600">
      Loading dogs...
    </p>
  ) : dogs.length > 0 ? (
    dogs.map((dog) => (
      <div
        key={dog.id}
        className="p-4 border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
      >
        <div className="relative">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-60 object-cover rounded-xl"
          />
          {/* Favorite Heart Button */}
          <button
            onClick={() => toggleFavorite(dog.id)}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all ${
              favorites.includes(dog.id)
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
          >
            {favorites.includes(dog.id) ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Dog Details */}
        <div className="mt-4 text-center">
          <h3 className="font-bold text-lg">{dog.name}</h3>
          <p className="text-gray-700 text-sm">Breed: {dog.breed}</p>
          <p className="text-gray-600 text-sm">Age: {dog.age} years</p>
          <p className="text-gray-500 text-sm">Location: {dog.zip_code}</p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(dog.id)}
          className={`w-full mt-4 px-4 py-2 rounded-xl font-semibold transition-all ${
            favorites.includes(dog.id)
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {favorites.includes(dog.id) ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>
    ))
  ) : (
    <p className="text-center col-span-2 md:col-span-3 text-lg font-semibold text-gray-600">
      No dogs available.
    </p>
  )}
</div>


    {/* Pagination */}
<div className="flex justify-between items-center mt-6">
  <button
    onClick={() => prevPageCursor && loadDogs(prevPageCursor)}
    disabled={!prevPageCursor}
    className={`px-4 py-2 rounded ${prevPageCursor ? "bg-gray-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
  >
    Previous
  </button>
  <button
    onClick={() => nextPageCursor && loadDogs(nextPageCursor)}
    disabled={!nextPageCursor}
    className={`px-4 py-2 rounded ${nextPageCursor ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
  >
    Next
  </button>
</div>

    </div>
  );
}
