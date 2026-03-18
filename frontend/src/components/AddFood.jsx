import { useState } from "react";
import api from "../services/api"; //
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // 🔍 SEARCH LOGIC
  // ===============================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Calls the new Spoonacular search route in your backend
      const res = await api.get(`/foods/search?query=${query}`);
      setResults(res.data);
      if (res.data.length === 0) {
        toast.error("No results found. Try a different food name.");
      }
    } catch (err) {
      console.error("Search Error:", err);
      toast.error("Failed to connect to the food database.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🍎 ADD TO LOG LOGIC
  // ===============================
  const handleAdd = async (food) => {
    try {
      // POST to your backend to save the food to MongoDB
      const res = await api.post("/foods", {
        ...food,
        date: new Date().toISOString().split('T')[0] // Ensures correct date format
      });
      
      /** * ✅ AUTOMATIC DASHBOARD UPDATE:
       * Calling onAdd(res.data) triggers the state update in Dashboard.jsx.
       * This instantly refreshes ProgressBar, SmartMessages, and FoodList.
       */
      onAdd(res.data); 
      
      toast.success(`${food.name} added to your log!`);
      setResults([]); // Clear search results after adding
      setQuery("");   // Clear search input
    } catch (err) {
      toast.error("Failed to save food item.");
    }
  };

  return (
    <div className="add-food-container">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            className="form-control neon-input"
            placeholder="Search e.g. Paneer, Chicken, Oats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-info px-4" type="submit" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <i className="bi bi-search"></i>
            )}
          </button>
        </div>
      </form>

      {/* Search Results List */}
      <div className="search-results-list" style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
        {results.map((food, index) => (
          <div key={index} className="search-result-item d-flex align-items-center mb-3 p-2 border rounded border-secondary bg-dark">
            <img 
              src={food.image} 
              alt={food.name} 
              style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
              className="me-3" 
            />
            
            <div className="flex-grow-1">
              <h6 className="text-white mb-0" style={{ textTransform: 'capitalize', fontSize: '15px' }}>
                {food.name}
              </h6>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                {food.calories} kcal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
              </p>
            </div>

            <button 
              className="btn btn-sm btn-success neon-btn" 
              onClick={() => handleAdd(food)}
              style={{ padding: '5px 15px' }}
            >
              Add
            </button>
          </div>
        ))}

        {results.length > 0 && (
          <p className="text-center text-muted small mt-2">
            Items shown per 100g serving
          </p>
        )}
      </div>
    </div>
  );
};

export default AddFood;