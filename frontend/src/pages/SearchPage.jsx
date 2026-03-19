import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api"; //
import Navbar from "../components/Navbar"; //
import toast from "react-hot-toast";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query"); // Extracts ?query=chicken from URL
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 1. FETCH RESULTS FROM BACKEND
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        // Calls the FatSecret search route in your backend
        const res = await api.get(`/foods/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Search Error:", err);
        toast.error("Global search failed. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  // ✅ 2. ADD SELECTED FOOD TO LOG
  const handleAddFood = async (food) => {
    try {
      // POSTs the selected item to your MongoDB database
      await api.post("/foods", {
        ...food,
        date: new Date().toISOString().split('T')[0] // Sets to today's date
      });
      
      toast.success(`${food.name} added to your log! 🥗`);
      // Optional: Navigate back to dashboard to see updated progress
      // navigate("/dashboard"); 
    } catch (err) {
      toast.error("Failed to add food item.");
    }
  };

  return (
    <div className="dashboard-bg min-vh-100">
      <Navbar /> {/* */}

      <div className="container mt-5 pt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white">
            Results for: <span className="neon-text">"{query}"</span>
          </h2>
          <button className="btn btn-outline-info btn-sm" onClick={() => navigate("/dashboard")}>
            <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center mt-5">
            <div className="spinner-border text-info" role="status"></div>
            <p className="text-muted mt-3">Searching global food database...</p>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && (
          <div className="row g-4">
            {results.map((food, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 bg-dark border-secondary p-3 shadow-lg">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="text-white text-capitalize mb-1">{food.name}</h5>
                    <button 
                      className="btn btn-sm btn-success neon-btn px-3" 
                      onClick={() => handleAddFood(food)}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-3">
                    <div className="d-flex gap-3 text-muted small">
                      <span>🔥 {food.calories} kcal</span>
                      <span>🥩 P: {food.protein}g</span>
                    </div>
                    <div className="d-flex gap-3 text-muted small mt-1">
                      <span>🍞 C: {food.carbs}g</span>
                      <span>🥑 F: {food.fats}g</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {!loading && results.length === 0 && (
              <div className="text-center mt-5 w-100">
                <i className="bi bi-search text-muted display-1"></i>
                <p className="text-white mt-3">No matching foods found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;