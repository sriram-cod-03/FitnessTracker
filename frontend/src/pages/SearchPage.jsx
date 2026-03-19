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
        // ✅ Added timestamp to bypass 304 cache
        const res = await api.get(`/foods/search?query=${query}&t=${Date.now()}`);
        setResults(res.data);
      } catch (err) {
        toast.error("Global search failed.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleAdd = async (food) => {
    try {
      await api.post("/foods", food);
      toast.success(`${food.name} added! 🥗`);
    } catch (err) {
      toast.error("Failed to add.");
    }
  };

  return (
    <div className="dashboard-bg min-vh-100">
      <Navbar />
      <div className="container mt-5 pt-4 text-white">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Results for "{query}"</h2>
          <button className="btn btn-sm btn-outline-info" onClick={() => navigate("/dashboard")}>Back</button>
        </div>
        {loading ? <div className="text-center mt-5"><div className="spinner-border text-info"></div></div> : (
          <div className="row g-4">
            {results.map((f, i) => (
              <div key={i} className="col-md-4 mb-3">
                <div className="card bg-dark border-secondary p-3 shadow-lg">
                  <div className="d-flex justify-content-between">
                    <h5 className="text-capitalize">{f.name}</h5>
                    <button className="btn btn-sm btn-success neon-btn" onClick={() => handleAdd(f)}>Add</button>
                  </div>
                  <p className="small text-muted mt-2">{f.calories} kcal | P: {f.protein}g | C: {f.carbs}g</p>
                </div>
              </div>
            ))}
            {results.length === 0 && !loading && <p className="text-center mt-5">No matching foods found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;