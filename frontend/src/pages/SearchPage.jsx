import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await api.get(`/foods/search?query=${query}`);
        setResults(res.data);
      } catch (err) {
        toast.error("Global search failed. Try a simpler term.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleAddFood = async (food) => {
    try {
      await api.post("/foods", {
        ...food,
        date: new Date().toISOString().split('T')[0]
      });
      toast.success(`${food.name} added to your log! 🥗`);
    } catch (err) {
      toast.error("Failed to add food.");
    }
  };

  return (
    <div className="dashboard-bg min-vh-100">
      <Navbar />
      <div className="container mt-5 pt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-white">Results for: <span className="neon-text">"{query}"</span></h2>
          <button className="btn btn-outline-info btn-sm" onClick={() => navigate("/dashboard")}>
            <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-info"></div>
            <p className="text-muted mt-3">Searching global database...</p>
          </div>
        ) : (
          <div className="row g-4">
            {results.map((food, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card h-100 bg-dark border-secondary p-3 shadow-lg">
                  <div className="d-flex justify-content-between">
                    <h5 className="text-white text-capitalize">{food.name}</h5>
                    <button className="btn btn-sm btn-success neon-btn" onClick={() => handleAddFood(food)}>Add</button>
                  </div>
                  <div className="mt-3 small text-muted">
                    🔥 {food.calories} kcal | 🥩 P: {food.protein}g | 🍞 C: {food.carbs}g
                  </div>
                </div>
              </div>
            ))}
            {results.length === 0 && !loading && (
              <div className="text-center mt-5 w-100">
                <i className="bi bi-search text-muted display-1"></i>
                <p className="text-white mt-3">No matching foods found. Try "chicken" or "egg".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;