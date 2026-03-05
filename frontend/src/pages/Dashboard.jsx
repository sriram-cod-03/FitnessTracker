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

  /* ===============================
     LOAD DASHBOARD DATA
  =============================== */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        /* GET USER NAME */

        const userRes = await api.get("/users/profile");

        console.log("USER DATA:", userRes.data);

        setUsername(userRes.data.name || "User");

        /* GET PROFILE DATA */

        const profileRes = await api.get("/profile");

        console.log("PROFILE DATA:", profileRes.data);

        if (!profileRes.data) {
          navigate("/setup-profile");
          return;
        }

        setStats(profileRes.data);

        /* GET TODAY FOODS */

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
  =============================== */

  const totalCalories = foods.reduce((sum, f) => sum + (f.calories || 0), 0);
  const totalProtein = foods.reduce((sum, f) => sum + (f.protein || 0), 0);
  const totalCarbs = foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
  const totalFats = foods.reduce((sum, f) => sum + (f.fats || 0), 0);
  const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);

  /* ===============================
     LOADING SCREEN
  =============================== */

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
      {/* NAVBAR */}

      <Navbar />

      {/* USERNAME */}

      <div className="welcome-user">Hello, {username} 👋</div>

      <div className="dashboard-bg">
        <div className="dashboard-container text-white">
          {/* HEADER */}

          <div className="dashboard-header">
            <h2 className="dashboard-title">Dashboard</h2>
          </div>

          {/* BODY STATS + SMART MESSAGE */}

          <div className="stats-grid">
            <div className="card">
              <h4>🎯 Body Stats</h4>

              <p>BMR: {stats.bmr}</p>
              <p>TDEE: {stats.tdee}</p>
              <p>Calories: {stats.calories}</p>
              <p>Protein: {stats.protein} g</p>
              <p>Carbs: {stats.carbs} g</p>
              <p>Fiber: {stats.fiber} g</p>
            </div>

            <div className="card smart">
              <SmartMessages
                remainingCalories={stats.calories - totalCalories}
                remainingProtein={stats.protein - totalProtein}
                remainingFiber={stats.fiber - totalFiber}
              />
            </div>
          </div>

          {/* DAILY PROGRESS */}

          <div className="card">
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

          <div className="card">
            <AddFood onAdd={(food) => setFoods((prev) => [food, ...prev])} />
          </div>

          {/* FOOD LIST */}

          <div className="card">
            <FoodList foods={foods} setFoods={setFoods} />
          </div>

          {/* WATER TRACKER */}

          <div className="card">
            <WaterTracker />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
