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
    <div className="dashboard-card mt-3">
      <h5 className="mb-3">📋 Today’s Foods</h5>

      {foods.length === 0 && (
        <p className="text-muted">No food added today 🍽️</p>
      )}

      {foods.map((food) => (
        <div key={food._id} className="food-row">
          {editingId === food._id ? (
            <>
              <input
                className="form-control"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
              <input
                className="form-control"
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
            </>
          ) : (
            <>
              <span>{food.name}</span>
              <span>{food.calories} kcal</span>

              <div className="food-actions">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEditClick(food)}
                >
                  ✏️
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(food._id)}
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoodList;
