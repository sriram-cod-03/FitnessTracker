import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fiber: "" });

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/foods", {
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein || 0),
        carbs: Number(form.carbs || 0),
        fats: Number(form.fiber || 0)
      });
      onAdd(res.data);
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "" });
      toast.success("Food added manually! 🍎");
    } catch (err) {
      toast.error("Failed to save.");
    }
  };

  return (
    <form onSubmit={handleManualSubmit} className="p-2">
      <input className="form-control mb-2 neon-input" placeholder="Food Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
      <div className="row g-2 mb-2">
        <div className="col"><input className="form-control neon-input" type="number" placeholder="kcal" value={form.calories} onChange={(e) => setForm({...form, calories: e.target.value})} required /></div>
        <div className="col"><input className="form-control neon-input" type="number" placeholder="Prot" value={form.protein} onChange={(e) => setForm({...form, protein: e.target.value})} /></div>
      </div>
      <div className="row g-2 mb-2">
        <div className="col"><input className="form-control neon-input" type="number" placeholder="Carbs" value={form.carbs} onChange={(e) => setForm({...form, carbs: e.target.value})} /></div>
        <div className="col"><input className="form-control neon-input" type="number" placeholder="Fiber" value={form.fiber} onChange={(e) => setForm({...form, fiber: e.target.value})} /></div>
      </div>
      <button type="submit" className="btn btn-success w-100 neon-btn">Add to Log</button>
    </form>
  );
};

export default AddFood;