import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const FoodList = ({ foods, setFoods }) => {
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [targetFood, setTargetFood] = useState(null);
  
  const [editData, setEditData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fiber: "",
  });

  // 1. OPEN CUSTOM MODAL INSTEAD OF WINDOW.CONFIRM
  const confirmDelete = (food) => {
    setTargetFood(food);
    setShowDeleteModal(true);
  };

  // 2. ACTUAL DELETE LOGIC
  const handleDelete = async () => {
    try {
      await api.delete(`/foods/${targetFood._id}`);
      setFoods((prev) => prev.filter((f) => f._id !== targetFood._id));
      toast.success(`${targetFood.name} removed! 🗑️`, {
        style: { background: '#333', color: '#fff', border: '1px solid #ef4444' }
      });
    } catch (error) {
      toast.error("Failed to delete food");
    } finally {
      setShowDeleteModal(false);
      setTargetFood(null);
    }
  };

  const handleEditClick = (food) => {
    setEditingId(food._id);
    setEditData({
      name: food.name,
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fiber: food.fiber || 0,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/foods/${id}`, editData);
      setFoods((prev) => prev.map((f) => (f._id === id ? res.data : f)));
      setEditingId(null);
      toast.success("Updated successfully! ✨");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="star-border">
      <div className="star-inner position-relative">
        
        {/* CUSTOM NEON DELETE MODAL OVERLAY */}
        {showDeleteModal && (
          <div className="modal-overlay d-flex align-items-center justify-content-center">
            <div className="custom-modal p-4 text-center shadow-lg border-info">
              <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
              <h4 className="text-white">Remove Food?</h4>
              <p className="text-muted small">Are you sure you want to delete <span className="text-info">"{targetFood?.name}"</span>?</p>
              <div className="d-flex gap-3 justify-content-center mt-4">
                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger rounded-pill px-4" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        <h3 className="mb-4 text-info d-flex align-items-center">
          <i className="bi bi-journal-text me-2"></i> Today's Foods
        </h3>

        {foods.length === 0 && (
          <p style={{ color: "#ffffff", opacity: 0.6 }}>No food added today 🍽️</p>
        )}

        {foods.map((food) => (
          <div key={food._id} className="stat mb-3 p-3 rounded" style={{ border: "1px solid #222", background: "rgba(255,255,255,0.02)" }}>
            {editingId === food._id ? (
              <div className="row g-2 w-100">
                <div className="col-12 mb-2">
                  <input className="form-control bg-dark text-white border-secondary" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div className="col-3"><input className="form-control bg-dark text-white border-secondary text-center" type="number" value={editData.calories} onChange={(e) => setEditData({ ...editData, calories: e.target.value })} /></div>
                <div className="col-2"><input className="form-control bg-dark text-white border-secondary text-center" type="number" value={editData.protein} onChange={(e) => setEditData({ ...editData, protein: e.target.value })} /></div>
                <div className="col-2"><input className="form-control bg-dark text-white border-secondary text-center" type="number" value={editData.carbs} onChange={(e) => setEditData({ ...editData, carbs: e.target.value })} /></div>
                <div className="col-2"><input className="form-control bg-dark text-white border-secondary text-center" type="number" value={editData.fiber} onChange={(e) => setEditData({ ...editData, fiber: e.target.value })} /></div>
                <div className="col-3"><button className="btn btn-success btn-sm w-100 h-100" onClick={() => handleUpdate(food._id)}>Save</button></div>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center w-100">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong style={{ fontSize: "16px", color: "#fff" }} className="text-capitalize">{food.name}</strong>
                  <span className="small mt-1" style={{ color: "#00FFFF" }}>
                    <span className="text-white">{food.calories}</span> kcal | 
                    P: <span className="text-white">{food.protein || 0}g</span> | 
                    C: <span className="text-white">{food.carbs || 0}g</span> | 
                    F: <span className="text-white">{food.fiber || 0}g</span>
                  </span>
                </div>

                <div className="food-actions" style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-sm btn-outline-warning border-0 fs-5" onClick={() => handleEditClick(food)}>
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  {/* CLICK TRIGGERS CUSTOM MODAL */}
                  <button className="btn btn-sm btn-outline-danger border-0 fs-5" onClick={() => confirmDelete(food)}>
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodList;