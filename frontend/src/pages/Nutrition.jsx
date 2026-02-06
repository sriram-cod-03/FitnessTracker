import { useEffect, useState } from "react";
import api from "../services/api";

const Nutrition = () => {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  const fetchFoods = async () => {
    const res = await api.get("/foods/today");
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/foods", form);
    setForm({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    });
    fetchFoods();
  };

  const deleteFood = async (id) => {
    await api.delete(`/foods/${id}`);
    fetchFoods();
  };

  const totals = foods.reduce(
    (acc, f) => {
      acc.calories += Number(f.calories);
      acc.protein += Number(f.protein);
      acc.carbs += Number(f.carbs);
      acc.fats += Number(f.fats);
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="container mt-4">
      <h3>🥗 Nutrition Tracker (Today)</h3>

      <form onSubmit={handleSubmit} className="row g-2">
        <input
          className="form-control"
          placeholder="Food name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Calories"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
          required
        />
        <input
          className="form-control"
          placeholder="Protein (g)"
          value={form.protein}
          onChange={(e) => setForm({ ...form, protein: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Carbs (g)"
          value={form.carbs}
          onChange={(e) => setForm({ ...form, carbs: e.target.value })}
        />
        <input
          className="form-control"
          placeholder="Fats (g)"
          value={form.fats}
          onChange={(e) => setForm({ ...form, fats: e.target.value })}
        />
        <button className="btn btn-success">Add</button>
      </form>

      <hr />

      <h5>📊 Today Totals</h5>
      <p>
        Calories: <strong>{totals.calories}</strong> kcal | Protein:{" "}
        <strong>{totals.protein}</strong> g | Carbs:{" "}
        <strong>{totals.carbs}</strong> g | Fats:{" "}
        <strong>{totals.fats}</strong> g
      </p>

      <h5>Your Foods</h5>
      {foods.map((f) => (
        <div key={f._id} className="card p-2 mb-2">
          <strong>{f.name}</strong> – {f.calories} kcal
          <br />
          P: {f.protein}g | C: {f.carbs}g | F: {f.fats}g
          <button
            className="btn btn-sm btn-danger mt-2"
            onClick={() => deleteFood(f._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Nutrition;
