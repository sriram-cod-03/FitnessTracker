import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [form, setForm] = useState({ 
    name: "", 
    calories: "", 
    protein: "", 
    carbs: "", 
    fats: "", 
    fiber: "" 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Name and Calories are mandatory
    if (!form.name || !form.calories) {
      return toast.error("Please enter at least the food name and calories.");
    }

    try {
      // ✅ Convert strings to Numbers before sending to backend
      const submissionData = {
        name: form.name.trim(),
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fats: Number(form.fats) || 0,
        fiber: Number(form.fiber) || 0,
        date: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD
      };

      const res = await api.post("/foods", submissionData);
      
      // ✅ Triggers the update for Dashboard charts and suggestions
      onAdd(res.data);
      
      // Reset form after success
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" });
      toast.success(`${submissionData.name} added to your log! 🍎`);
    } catch (err) {
      toast.error("Failed to save food item.");
    }
  };

  return (
    <div className="add-food-container">
      <form onSubmit={handleManualSubmit}>
        <div className="mb-2">
          <input
            name="name"
            className="form-control neon-input"
            placeholder="Food Name (e.g., Oats)"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col">
            <input name="calories" type="number" className="form-control neon-input" placeholder="kcal" value={form.calories} onChange={handleChange} required />
          </div>
          <div className="col">
            <input name="protein" type="number" className="form-control neon-input" placeholder="Protein (g)" value={form.protein} onChange={handleChange} />
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col">
            <input name="carbs" type="number" className="form-control neon-input" placeholder="Carbs (g)" value={form.carbs} onChange={handleChange} />
          </div>
          <div className="col">
            <input name="fats" type="number" className="form-control neon-input" placeholder="Fats (g)" value={form.fats} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-3">
          <input name="fiber" type="number" className="form-control neon-input" placeholder="Fiber (g)" value={form.fiber} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-success w-100 neon-btn">
          Add to Daily Logs
        </button>
      </form>
    </div>
  );
};

export default AddFood;