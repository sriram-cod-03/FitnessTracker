import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AddFood = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" });
  const [isScanning, setIsScanning] = useState(false);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ AI Scanning Logic
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];
      
      try {
        const res = await api.post("/ai/scan-meal", { base64Image });
        setForm(res.data); // Auto-fills the form
        toast.success(`Identified: ${res.data.name}! 🥗`);
      } catch (err) {
        toast.error("AI couldn't recognize the meal.");
      } finally {
        setIsScanning(false);
      }
    };
  };

  return (
    <div className="add-food-card">
      <div className="scanner-section mb-3">
        <label className={`ai-scan-btn ${isScanning ? 'scanning' : ''}`}>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <i className="bi bi-camera-fill me-2"></i>
          {isScanning ? "AI Analyzing..." : "Scan Meal with AI"}
          {isScanning && <div className="laser-line"></div>}
        </label>
      </div>

      <form className="custom-form">
        <input name="name" className="form-control mb-2" placeholder="Food Name" value={form.name} onChange={handleInputChange} required />
        <div className="form-row">
           <input name="calories" type="number" className="form-control" placeholder="kcal" value={form.calories} onChange={handleInputChange} />
           <input name="protein" type="number" className="form-control" placeholder="Protein (g)" value={form.protein} onChange={handleInputChange} />
        </div>
        <div className="form-row mt-2">
           <input name="carbs" type="number" className="form-control" placeholder="Carbs (g)" value={form.carbs} onChange={handleInputChange} />
           <input name="fats" type="number" className="form-control" placeholder="Fats (g)" value={form.fats} onChange={handleInputChange} />
        </div>
        <button type="button" className="neon-btn w-100 mt-3" onClick={() => onAdd(form)}>Add to Tracker</button>
      </form>
    </div>
  );
};

export default AddFood;