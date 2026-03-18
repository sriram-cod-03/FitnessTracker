import { useState } from "react";
import api from "../services/api"; //
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // SEARCH FOR FOOD
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/foods/search?query=${query}`);
      setResults(res.data);
      if (res.data.length === 0) toast.error("No global matches found.");
    } catch (err) {
      toast.error("Global search failed. Check your API settings.");
    } finally {
      setLoading(false);
    }
  };

  // ADD TO LOG & DASHBOARD
  const handleAdd = async (food) => {
    try {
      const res = await api.post("/foods", {
        ...food,
        date: new Date().toISOString().split('T')[0]
      });
      
      /** * ✅ AUTOMATIC UPDATE:
       * Calling onAdd(res.data) triggers the state update in Dashboard.jsx.
       * This instantly refreshes ProgressBar and SmartMessages.
       */
      onAdd(res.data); 
      
      toast.success(`${food.name} added! 🍎`);
      setResults([]);
      setQuery("");
    } catch (err) {
      toast.error("Error saving food item.");
    }
  };

  return (
    <div className="add-food-container">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            className="form-control neon-input"
            placeholder="Search Global Foods (e.g. Biryani, Sushi)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-info" type="submit" disabled={loading}>
            {loading ? <i className="bi bi-hourglass-split"></i> : <i className="bi bi-search"></i>}
          </button>
        </div>
      </form>

      {/* Results Section */}
      <div className="search-results-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {results.map((food, index) => (
          <div key={index} className="search-item d-flex align-items-center mb-2 p-2 border rounded border-secondary bg-dark">
            <div className="flex-grow-1">
              <h6 className="mb-0 text-white" style={{ fontSize: '14px' }}>{food.name}</h6>
              <small className="text-muted">{food.calories} kcal | P: {food.protein}g | C: {food.carbs}g</small>
            </div>
            <button className="btn btn-sm btn-success neon-btn" onClick={() => handleAdd(food)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFood;