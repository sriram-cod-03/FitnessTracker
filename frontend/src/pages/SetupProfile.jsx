import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FullScreenLoader from "../components/FullScreenLoader";
import "../styles/setupProfile.css";

const SetupProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: "", height: "", weight: "", gender: "male",
    activityLevel: "moderate", goal: "cut", dietPreference: "nonveg",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start "Setting up your profile" loader

    try {
      await api.post("/profile", {
        age: Number(form.age),
        height: Number(form.height),
        weight: Number(form.weight),
        gender: form.gender,
        activityLevel: form.activityLevel,
        goal: form.goal,
        dietPreference: form.dietPreference,
      });

      // After setup, move to Dashboard.
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Profile setup failed", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <FullScreenLoader
        title="Setting up your profile 🧠"
        subtitle="Calculating your fitness goals..."
      />
    );
  }

  return (
    <div className="setup-bg">
      <div className="setup-overlay">
        <div className="star-border setup-card-width">
          <div className="star-inner">
            <h3 className="setup-title"><i className="bi bi-person-plus-fill me-2"></i> Setup Your Profile</h3>
            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-row">
                <div className="input-group-custom">
                  <label>Age</label>
                  <input name="age" type="number" placeholder="Years" value={form.age} onChange={handleChange} required />
                </div>
                <div className="input-group-custom">
                  <label>Height (cm)</label>
                  <input name="height" type="number" placeholder="cm" value={form.height} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group-custom">
                  <label>Weight (kg)</label>
                  <input name="weight" type="number" placeholder="kg" value={form.weight} onChange={handleChange} required />
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
              <button type="submit" className="setup-btn-neon">Save & Continue</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;