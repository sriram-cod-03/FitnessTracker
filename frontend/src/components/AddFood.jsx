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
  const [isScanning, setIsScanning] = useState(false);

  // ✅ Image Compression Logic
  const compressImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7).split(",")[1]);
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      try {
        const compressedBase64 = await compressImage(reader.result);
        
        // POST to AI Route
        const res = await api.post("/ai/scan-meal", { base64Image: compressedBase64 });
        
        // Auto-fill form with AI data
        setForm({
          name: res.data.name || "",
          calories: res.data.calories || "",
          protein: res.data.protein || "",
          carbs: res.data.carbs || "",
          fats: res.data.fats || "",
          fiber: res.data.fiber || ""
        });
        
        toast.success(`AI Identified: ${res.data.name}! 🥗`);
      } catch (err) {
        console.error("Scanning Error:", err);
        // This triggers if Render returns 500
        toast.error("AI scanning failed. Check your Render API Key settings."); 
      } finally {
        setIsScanning(false);
      }
    };
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.calories) return toast.error("Enter at least name and calories");

    try {
      // Ensure the backend adds the 'date' field or handle it here
      const res = await api.post("/foods", form);
      onAdd(res.data);
      setForm({ name: "", calories: "", protein: "", carbs: "", fats: "", fiber: "" });
      toast.success("Food added successfully!");
    } catch (err) {
      toast.error("Failed to save food.");
    }
  };

  return (
    <div className="add-food-container">
      <div className="scanner-wrapper mb-3">
        <label className={`ai-scan-label ${isScanning ? 'scanning-active' : ''}`}>
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          <i className={`bi ${isScanning ? 'bi-arrow-repeat spin' : 'bi-camera-fill'} me-2`}></i>
          {isScanning ? "AI Analyzing Meal..." : "Scan Meal with AI"}
          {isScanning && <div className="laser-line"></div>}
        </label>
      </div>

      <form onSubmit={handleManualSubmit}>
        <div className="mb-2">
          <input
            name="name"
            className="form-control neon-input"
            placeholder="Food Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col">
            <input name="calories" type="number" className="form-control neon-input" placeholder="kcal" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} required />
          </div>
          <div className="col">
            <input name="protein" type="number" className="form-control neon-input" placeholder="Protein (g)" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col">
            <input name="carbs" type="number" className="form-control neon-input" placeholder="Carbs (g)" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} />
          </div>
          <div className="col">
             {/* Added Fats field which was missing in your previous form state updates */}
            <input name="fiber" type="number" className="form-control neon-input" placeholder="Fiber (g)" value={form.fiber} onChange={(e) => setForm({ ...form, fiber: e.target.value })} />
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100 neon-btn">
          Add to Daily Logs
        </button>
      </form>
    </div>
  );
};

export default AddFood;