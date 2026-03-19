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
    if (!form.name || !form.calories) {
      return toast.error("Please enter at least the food name and calories.");
    }

    try {
      const submissionData = {
        name: form.name.trim(),
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fats: Number(form.fats) || 0,
        fiber: Number(form.fiber) || 0,
        date: new Date().toISOString().split('T')[0]
      };

      const res = await api.post("/foods", submissionData);
      onAdd(res.data);
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" });
      toast.success(`${submissionData.name} added manually! 🍎`);
    } catch (err) {
      toast.error("Failed to save food item.");
    }
  };

  return (
    <div className="add-food-container">
      <form onSubmit={handleManualSubmit}>
        <div className="mb-2">
          <input name="name" className="form-control neon-input" placeholder="Food Name (e.g., Oats)" value={form.name} onChange={handleChange} required />
        </div>
        <div className="row g-2 mb-2">
          <div className="col">
            <input name="calories" type="number" className="form-control neon-input" placeholder="kcal" value={form.calories} onChange={handleChange} required />
          </div>
          <div className="col">
            <input name="protein" type="number" className="form-control neon-input" placeholder="Prot (g)" value={form.protein} onChange={handleChange} />
          </div>
        </div>
        <div className="row g-2 mb-2">
          <div className="col">
            <input name="carbs" type="number" className="form-control neon-input" placeholder="Carb (g)" value={form.carbs} onChange={handleChange} />
          </div>
          <div className="col">
            <input name="fats" type="number" className="form-control neon-input" placeholder="Fat (g)" value={form.fats} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-success w-100 neon-btn">Add to Daily Log</button>
      </form>
    </div>
  );
};

export default AddFood;