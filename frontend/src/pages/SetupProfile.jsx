import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FullScreenLoader from "../components/FullScreenLoader";
import "../styles/setupProfile.css";

const SetupProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // ✅ FORM STATE
  const [form, setForm] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    activityLevel: "moderate",
    goal: "cut",
    dietPreference: "nonveg",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Profile setup failed", err);
      setLoading(false);
    }
  };

  // FULL SCREEN LOADER
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
        <div className="setup-card">
          <h3 className="text-center mb-4">
            Setup Your Fitness Profile 💪
          </h3>

          <form onSubmit={handleSubmit}>
            {/* AGE */}
            <input
              name="age"
              className="form-control mb-2"
              placeholder="Age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />

            {/* HEIGHT */}
            <input
              name="height"
              className="form-control mb-2"
              placeholder="Height (cm)"
              type="number"
              value={form.height}
              onChange={handleChange}
              required
            />

            {/* WEIGHT */}
            <input
              name="weight"
              className="form-control mb-2"
              placeholder="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={handleChange}
              required
            />

            {/* GENDER */}
            <select
              name="gender"
              className="form-control mb-2"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            {/* ACTIVITY LEVEL */}
            <select
              name="activityLevel"
              className="form-control mb-2"
              value={form.activityLevel}
              onChange={handleChange}
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Very Active</option>
            </select>

            {/* GOAL */}
            <select
              name="goal"
              className="form-control mb-2"
              value={form.goal}
              onChange={handleChange}
            >
              <option value="cut">Fat Loss</option>
              <option value="maintain">Maintain</option>
              <option value="bulk">Muscle Gain</option>
            </select>

            {/* DIET PREFERENCE */}
            <select
              name="dietPreference"
              className="form-control mb-3"
              value={form.dietPreference}
              onChange={handleChange}
            >
              <option value="veg">Vegetarian</option>
              <option value="egg">Eggetarian</option>
              <option value="nonveg">Non-Vegetarian</option>
            </select>

            {/* SUBMIT */}
            <button className="btn btn-success w-100">
              Save & Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;
