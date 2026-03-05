import { useState } from "react";
import api from "../services/api";

const FoodList = ({ foods, setFoods }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    calories: "",
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this food?")) return;
    try {
      await api.delete(`/foods/${id}`);
      setFoods((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
      alert("Failed to delete food");
    }
  };

  const handleEditClick = (food) => {
    setEditingId(food._id);
    setEditData({
      name: food.name,
      calories: food.calories,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/foods/${id}`, editData);
      setFoods((prev) =>
        prev.map((f) => (f._id === id ? res.data : f))
      );
      setEditingId(null);
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="star-border">
      <div className="star-inner">
        <h3 className="mb-4">
          <i className="bi bi-journal-text me-2"></i> Today's Foods
        </h3>

        {foods.length === 0 && (
          <p style={{ color: "#ffffff", opacity: 0.6 }}>No food added today 🍽️</p>
        )}

        {foods.map((food) => (
          <div key={food._id} className="stat">
            {editingId === food._id ? (
              <div className="d-flex gap-2 w-100">
                <input
                  className="form-control"
                  style={{ background: "#111", color: "#fff", border: "1px solid #333" }}
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
                <input
                  className="form-control"
                  style={{ background: "#111", color: "#fff", border: "1px solid #333", width: "100px" }}
                  type="number"
                  value={editData.calories}
                  onChange={(e) =>
                    setEditData({ ...editData, calories: e.target.value })
                  }
                />
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleUpdate(food._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "16px" }}>{food.name}</strong>
                  <span className="neon-value" style={{ fontSize: "14px" }}>
                    {food.calories} kcal
                  </span>
                </div>

                <div className="food-actions" style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-sm"
                    style={{ background: "rgba(255, 193, 7, 0.2)", color: "#ffc107", border: "1px solid #ffc107" }}
                    onClick={() => handleEditClick(food)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444" }}
                    onClick={() => handleDelete(food._id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;