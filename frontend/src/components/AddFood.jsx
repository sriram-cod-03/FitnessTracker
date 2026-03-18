import { useState } from "react";
import api from "../services/api"; 
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/foods/search?query=${query}`);
      setResults(res.data);
      if (res.data.length === 0) toast.error("No results found.");
    } catch (err) {
      toast.error("Global search failed. Check your API settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (food) => {
    try {
      const res = await api.post("/foods", {
        ...food,
        date: new Date().toISOString().split('T')[0]
      });
      
      onAdd(res.data); // Refreshes dashboard instantly
      
      toast.success(`${food.name} added!`);
      setResults([]);
      setQuery("");
    } catch (err) {
      toast.error("Failed to save food.");
    }
  };

  return (
    <div className="add-food-container">
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            className="form-control neon-input"
            placeholder="Search Global Foods..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-info" type="submit" disabled={loading}>
            {loading ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-search"></i>}
          </button>
        </div>
      </form>

      <div className="results-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {results.map((food, idx) => (
          <div key={idx} className="search-item d-flex align-items-center mb-2 p-2 border rounded border-secondary bg-dark">
            <div className="flex-grow-1">
              <h6 className="text-white mb-0" style={{ fontSize: '14px' }}>{food.name}</h6>
              <small className="text-muted">{food.calories} kcal | P: {food.protein}g</small>
            </div>
            <button className="btn btn-sm btn-success neon-btn" onClick={() => handleAdd(food)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFood;