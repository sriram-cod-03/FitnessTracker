import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/waterTracker.css";

const WaterTracker = () => {
  const WATER_GOAL = 3000; // ml
  const STEP_GOAL = 10000;

  const [water, setWater] = useState(0);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load today's data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/water/today");
        setWater(res.data.water || 0);
        setSteps(res.data.steps || 0);
      } catch (err) {
        console.error("Failed to load water data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const addWater = async (amount) => {
    try {
      const res = await api.post("/water/add-water", { amount });
      setWater(res.data.water);
    } catch (err) {
      console.error("Add water failed");
    }
  };

  const updateSteps = async (value) => {
    setSteps(value);
    try {
      await api.post("/water/steps", { steps: value });
    } catch (err) {
      console.error("Steps update failed");
    }
  };

  if (loading) {
    return (
      <div className="water-card loading">
        <div className="spinner"></div>
        <p>Loading water tracker...</p>
      </div>
    );
  }

  return (
    <div className="water-card">
      <h3>💧 Water & 🚶 Steps</h3>

      {/* WATER */}
      <div className="tracker-section">
        <div className="tracker-header">
          <span>Water Intake</span>
          <span>{water} / {WATER_GOAL} ml</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill water"
            style={{ width: `${Math.min((water / WATER_GOAL) * 100, 100)}%` }}
          />
        </div>

        <div className="water-buttons">
          <button onClick={() => addWater(250)}>+250 ml</button>
          <button onClick={() => addWater(500)}>+500 ml</button>
          <button onClick={() => addWater(1000)}>+1 L</button>
        </div>
      </div>

      {/* STEPS */}
      <div className="tracker-section">
        <div className="tracker-header">
          <span>Steps</span>
          <span>{steps} / {STEP_GOAL}</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill steps"
            style={{ width: `${Math.min((steps / STEP_GOAL) * 100, 100)}%` }}
          />
        </div>

        <input
          type="number"
          className="steps-input"
          placeholder="Enter steps"
          value={steps}
          onChange={(e) => updateSteps(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default WaterTracker;
