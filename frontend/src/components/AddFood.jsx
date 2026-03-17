import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [form, setForm] = useState({ 
    name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" 
  });

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Name and Calories are mandatory
    if (!form.name || !form.calories) {
      return toast.error("Please enter at least the food name and calories.");
    }

    try {
      const res = await api.post("/foods", form);
      onAdd(res.data);
      
      // Reset form after success
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" });
      toast.success("Food added to your log! 🍎");
    } catch (err) {
      toast.error("Failed to save food. Please try again.");
    }
  };

  return (
    <div className="add-food-container">
      <form onSubmit={handleManualSubmit}>
        <div className="mb-2">
          <input
            name="name"
            className="form-control neon-input"
            placeholder="Food Name (e.g., Chicken Biryani)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col">
            <input name="calories" type="number" className="form-control neon-input" placeholder="Calories (kcal)" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required />
          </div>
          <div className="col">
            <input name="protein" type="number" className="form-control neon-input" placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col">
            <input name="carbs" type="number" className="form-control neon-input" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
          </div>
          <div className="col">
            <input name="fats" type="number" className="form-control neon-input" placeholder="Fats (g)" value={form.fats} onChange={(e) => setForm({ ...form, fats: e.target.value })} />
          </div>
        </div>

        <div className="mb-3">
          <input name="fiber" type="number" className="form-control neon-input" placeholder="Fiber (g)" value={form.fiber} onChange={(e) => setForm({ ...form, fiber: e.target.value })} />
        </div>

        <button type="submit" className="btn btn-success w-100 neon-btn">
          Add to Daily Logs
        </button>
      </form>
    </div>
  );
};

export default AddFood;