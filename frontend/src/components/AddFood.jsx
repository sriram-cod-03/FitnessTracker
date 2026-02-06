import { useState } from "react";
import api from "../services/api";

const AddFood = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/foods", {
        name: form.name,
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fats: Number(form.fats),
        fiber: Number(form.fiber),
      });

      onAdd(res.data);

      setForm({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        fiber: "",
      });
    } catch (err) {
      alert("Failed to add food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card add-food-card mt-4" style={{ marginBottom: "8px", padding: "6px" }}>
      <h5 className="mb-3 text-center">🥗 Add Food</h5>

      <form onSubmit={handleSubmit} className="add-food-form">
        <input
          className="form-control"
          name="name"
          placeholder="Food name (e.g. Rice)"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          className="form-control"
          type="number"
          name="calories"
          placeholder="Calories"
          value={form.calories}
          onChange={handleChange}
          required
        />

        <input
          className="form-control"
          type="number"
          name="protein"
          placeholder="Protein (g)"
          value={form.protein}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="carbs"
          placeholder="Carbs (g)"
          value={form.carbs}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="fats"
          placeholder="Fats (g)"
          value={form.fats}
          onChange={handleChange}
        />

        <input
          className="form-control"
          type="number"
          name="fiber"
          placeholder="Fiber (g)"
          value={form.fiber}
          onChange={handleChange}
        />

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Adding..." : "Add Food"}
        </button>
      </form>
    </div>
  );
};

export default AddFood;
