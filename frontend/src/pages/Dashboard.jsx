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

  // PROFILE STATS
  const [stats, setStats] = useState({
    bmr: 0,
    tdee: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fiber: 0,
  });

  // TODAY FOODS
  const [foods, setFoods] = useState([]);

  /* ===============================
     LOAD DASHBOARD DATA
  ================================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // PROFILE
        const profileRes = await api.get("/profile");

        // If profile not created yet → setup profile
        if (!profileRes.data) {
          navigate("/setup-profile");
          return;
        }

        setStats(profileRes.data);

        // TODAY FOODS
        try {
          const foodRes = await api.get("/foods/today");
          setFoods(Array.isArray(foodRes.data) ? foodRes.data : []);
        } catch (err) {
          console.error("Food fetch failed", err);
          setFoods([]);
        }
      } catch (err) {
        console.error("Dashboard load failed", err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  /* ===============================
     DAILY TOTALS
  ================================= */
  const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFats = foods.reduce((sum, f) => sum + (f.fats || 0), 0);
  const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);

  /* ===============================
     FULL SCREEN LOADER
  ================================= */
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
        <div className="dashboard-container text-white">
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "10px",
            }}
          >
            <h2 className="dashboard-title">Dashboard</h2>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* DIET PLAN BUTTON */}
              <button
                onClick={() => navigate("/diet-plan")}
                style={{
                  background: "#ffcc00",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🥗 Diet Plan
              </button>

              {/* EDIT PROFILE BUTTON */}
              <button
                onClick={() => navigate("/edit-profile")}
                style={{
                  background: "#00ffcc",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>

          {/* STATS + SMART MESSAGE */}
          <div className="stats-grid">
            <div className="card text-white">
              <h4>🎯 Body Stats</h4>
              <p className="stat">
                BMR: <span>{stats.bmr}</span>
              </p>
              <p className="stat">
                TDEE: <span>{stats.tdee}</span>
              </p>
              <p className="stat">
                Calories: <span>{stats.calories}</span>
              </p>
              <p className="stat">
                Protein: <span>{stats.protein} g</span>
              </p>
              <p className="stat">
                Carbs: <span>{stats.carbs} g</span>
              </p>
              <p className="stat">
                Fiber: <span>{stats.fiber} g</span>
              </p>
            </div>

            <div className="card smart text-white">
              <SmartMessages
                remainingCalories={stats.calories - totalCalories}
                remainingProtein={stats.protein - totalProtein}
                remainingFiber={stats.fiber - totalFiber}
              />
            </div>
          </div>

          {/* DAILY PROGRESS */}
          <div className="card text-white">
            <h4>📊 Daily Progress</h4>

            <ProgressBar
              label="Calories"
              current={totalCalories}
              target={stats.calories}
              unit="kcal"
            />

            <ProgressBar
              label="Protein"
              current={totalProtein}
              target={stats.protein}
              unit="g"
            />

            <ProgressBar
              label="Carbs"
              current={totalCarbs}
              target={stats.carbs}
              unit="g"
            />

            <ProgressBar
              label="Fats"
              current={totalFats}
              target={60}
              unit="g"
            />

            <ProgressBar
              label="Fiber"
              current={totalFiber}
              target={stats.fiber}
              unit="g"
            />
          </div>

          {/* ADD FOOD */}
          <div className="card add-food text-white">
            <AddFood onAdd={(food) => setFoods((prev) => [food, ...prev])} />
          </div>

          {/* FOOD LIST */}
          <div className="card text-white">
            <FoodList foods={foods} setFoods={setFoods} />
          </div>

          <div className="card text-white">
            <WaterTracker />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
