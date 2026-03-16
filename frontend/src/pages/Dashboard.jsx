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
  const [username, setUsername] = useState("Athlete");
  const [stats, setStats] = useState({
    bmr: 0, tdee: 0, calories: 0, protein: 0, carbs: 0, fiber: 0,
  });
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1. Load User Profile (Name)
        const userRes = await api.get("/user/profile");
        setUsername(userRes.data.name || "Athlete");

        // 2. Load Fitness Stats (Handle 404 for new users)
        try {
          const profileRes = await api.get("/profile");
          setStats(profileRes.data);
        } catch (profileErr) {
          if (profileErr.response?.status === 404) {
            navigate("/setup-profile");
            return;
          }
        }

        // 3. Load Food Logs
        const foodRes = await api.get("/foods/today");
        setFoods(Array.isArray(foodRes.data) ? foodRes.data : []);

      } catch (err) {
        console.error("Dashboard sync error:", err);
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

  // DAILY TOTALS CALCULATION
  const totals = foods.reduce((acc, f) => ({
    cal: acc.cal + (Number(f.calories) || 0),
    pro: acc.pro + (Number(f.protein) || 0),
    carb: acc.carb + (Number(f.carbs) || 0),
    fat: acc.fat + (Number(f.fats) || 0),
    fib: acc.fib + (Number(f.fiber) || 0),
  }), { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 });

  if (loading) {
    return <FullScreenLoader title="Syncing Fitness Data 💪" subtitle="Talking to the AI..." />;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-bg">
        <div className="dashboard-container">
          <div className="welcome-user">Hello, {username} 👋</div>
          
          <div className="stats-grid">
            <div className="card text-white">
              <h3><i className="bi bi-person-vcard-fill me-2"></i>Body Stats</h3>
              <div className="stat">Daily Goal: <span className="neon-text">{stats.calories} kcal</span></div>
              <div className="stat">Protein Target: <span className="neon-text">{stats.protein} g</span></div>
              <div className="stat">Fiber Target: <span className="neon-text">{stats.fiber} g</span></div>
            </div>

            <div className="card smart">
              <h3><i className="bi bi-lightbulb-fill me-2" style={{color: "#00ffcc"}}></i>AI Suggestions</h3>
              <SmartMessages
                remainingCalories={stats.calories - totals.cal}
                remainingProtein={stats.protein - totals.pro}
                remainingFiber={stats.fiber - totals.fib}
              />
            </div>
          </div>

          <div className="card mb-4">
            <h3><i className="bi bi-bar-chart-fill me-2"></i>Daily Progress</h3>
            <div className="progress-section text-white">
                <ProgressBar label="Calories" current={totals.cal} target={stats.calories} unit="kcal" />
                <ProgressBar label="Protein" current={totals.pro} target={stats.protein} unit="g" />
                <ProgressBar label="Carbs" current={totals.carb} target={stats.carb} unit="g" />
                <ProgressBar label="Fiber" current={totals.fib} target={stats.fiber} unit="g" />
            </div>
          </div>

          <div className="stats-grid">
            <div className="card">
              <h3><i className="bi bi-plus-circle-fill me-2"></i>Add Food</h3>
              <AddFood onAdd={(food) => setFoods((prev) => [food, ...prev])} />
            </div>
            <div className="card">
              <FoodList foods={foods} setFoods={setFoods} />
            </div>
          </div>

          <div className="mt-4">
            <h3><i className="bi bi-droplet-fill me-2" style={{color: "#00d4ff"}}></i>Hydration</h3>
            <WaterTracker />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;