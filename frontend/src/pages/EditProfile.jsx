import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import FullScreenLoader from "../components/FullScreenLoader";
import toast from "react-hot-toast";
import "../styles/editProfile.css"; 

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "maintain",
    dietPreference: "nonveg",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/profile");
        if (!res.data) {
          navigate("/setup-profile");
          return;
        }
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/profile", { 
        ...form, 
        age: Number(form.age), 
        height: Number(form.height), 
        weight: Number(form.weight) 
      });
      toast.success("Profile updated & recalculated 💪");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error("Update failed");
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader title="Updating your profile ✏️" subtitle="Recalculating goals..." />;

  return (
    <>
      <Navbar />
      <div className="edit-profile-bg">
        <div className="star-border edit-card-width">
          <div className="star-inner">
            <h3 className="edit-title">
              <i className="bi bi-pencil-square me-2"></i> Edit Fitness Profile
            </h3>

            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-row">
                <div className="input-group-custom">
                  <label>Age</label>
                  <input name="age" type="number" value={form.age} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <label>Height (cm)</label>
                  <input name="height" type="number" value={form.height} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="input-group-custom">
                  <label>Weight (kg)</label>
                  <input name="weight" type="number" value={form.weight} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="input-group-custom">
                <label>Activity Level</label>
                <select name="activityLevel" value={form.activityLevel} onChange={handleChange}>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Very Active</option>
                </select>
              </div>

              <div className="input-group-custom">
                <label>Fitness Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange}>
                  <option value="cut">Fat Loss</option>
                  <option value="maintain">Maintain</option>
                  <option value="bulk">Muscle Gain</option>
                </select>
              </div>

              <div className="input-group-custom">
                <label>Diet Preference</label>
                <select name="dietPreference" value={form.dietPreference} onChange={handleChange}>
                  <option value="veg">Vegetarian</option>
                  <option value="egg">Eggetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>

              <button type="submit" className="save-btn-neon">
                Update Profile & Recalculate
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;