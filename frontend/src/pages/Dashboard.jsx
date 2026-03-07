import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import WaterTracker from "../components/WaterTracker";
import Navbar from "../components/Navbar";
import AddFood from "../components/AddFood";
import FoodList from "../components/FoodList";
import SmartMessages from "../components/SmartMessage";
import ProgressBar from "../components/ProgressBar";
import FullScreenLoader from "../components/FullScreenLoader";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const [stats, setStats] = useState({
    bmr: 0,
    tdee: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fiber: 0,
  });

  const [foods, setFoods] = useState([]);

useEffect(() => {
  const loadDashboard = async () => {
    try {
      // 1. Load User data
      const userRes = await api.get("/users/profile");
      setUsername(userRes.data.name || "User");

      // 2. Load Fitness Profile (Handle 404 separately)
      try {
        const profileRes = await api.get("/profile");
        setStats(profileRes.data);
      } catch (profileErr) {
        if (profileErr.response?.status === 404) {
          // If profile doesn't exist yet, go to setup
          navigate("/setup-profile");
          return;
        }
      }

      // 3. Load Food data
      const foodRes = await api.get("/foods/today");
      setFoods(Array.isArray(foodRes.data) ? foodRes.data : []);

    } catch (err) {
      console.error("Dashboard load failed", err);
      // Only logout if the error is 401 (Invalid Token)
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, [navigate]);

  /*DAILY TOTALS*/
  const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFats = foods.reduce((sum, f) => sum + (f.fats || 0), 0);
  const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);

  if (loading) {
    return (
      <FullScreenLoader
        title="Loading your dashboard 💪"
        subtitle="Fetching your fitness data..."
      />
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-bg">
        <div className="dashboard-container">
          <div className="welcome-user">Hello, {username} 👋</div>
          {/* BODY STATS + SMART MESSAGE */}
          <div className="stats-grid">
            <div className="card text-white">
              <h3><i className="bi bi-person-vcard-fill me-2"></i>Body Stats</h3>
              <div className="stat">BMR: <span>{stats.bmr}</span></div>
              <div className="stat">TDEE: <span>{stats.tdee}</span></div>
              <div className="stat">Daily Goal: <span>{stats.calories} kcal</span></div>
              <div className="stat">Target Protein: <span>{stats.protein} g</span></div>
              <div className="stat">Target Carbs: <span>{stats.carbs} g</span></div>
              <div className="stat">Target Fiber: <span>{stats.fiber} g</span></div>
            </div>

            <div className="card smart">
              <h3><i className="bi bi-lightbulb-fill me-2" style={{color: "#00ffcc"}}></i>Smart Suggestions</h3>
              <SmartMessages
                remainingCalories={stats.calories - totalCalories}
                remainingProtein={stats.protein - totalProtein}
                remainingFiber={stats.fiber - totalFiber}
              />
            </div>
          </div>

          {/* DAILY PROGRESS */}
          <div className="card">
            <h3><i className="bi bi-bar-chart-fill me-2"></i>Daily Progress</h3>
            <div className="progress-section text-white">
                <ProgressBar label="Calories" current={totalCalories} target={stats.calories} unit="kcal" />
                <ProgressBar label="Protein" current={totalProtein} target={stats.protein} unit="g" />
                <ProgressBar label="Carbs" current={totalCarbs} target={stats.carbs} unit="g" />
                <ProgressBar label="Fats" current={totalFats} target={60} unit="g" />
                <ProgressBar label="Fiber" current={totalFiber} target={stats.fiber} unit="g" />
            </div>
          </div>

          {/* FOOD MANAGEMENT */}
          <div className="stats-grid">
            <div className="card">
              <h3><i className="bi bi-plus-circle-fill me-2"></i>Add Food</h3>
              <AddFood onAdd={(food) => setFoods((prev) => [food, ...prev])} />
            </div>

            <div className="card">
              <FoodList foods={foods} setFoods={setFoods} />
            </div>
          </div>

          {/* WATER TRACKER */}
            <h3><i className="bi bi-droplet-fill me-2" style={{color: "#00d4ff"}}></i>Hydration</h3>
            <WaterTracker />
         

        </div>
      </div>
    </>
  );
};

export default Dashboard;