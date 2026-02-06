import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import FullScreenLoader from "../components/FullScreenLoader";
import "../styles/dietPlan.css";

/* ===============================
   MEAL CARD COMPONENT
================================ */
const MealCard = ({ title, meal }) => {
  if (!meal || !meal.items || meal.items.length === 0) return null;

  return (
    <div className="diet-card">
      <h3>{title}</h3>

      {meal.items.map((item, index) => (
        <div key={index} className="food-row">
          <div className="food-name">
            <strong>{item.name}</strong>
            <span className="grams">({item.grams} g)</span>
          </div>

          <p className="macros">
            Protein: {item.protein} g |{" "}
            Carbs: {item.carbs} g |{" "}
            Fats: {item.fats} g |{" "}
            Fiber: {item.fiber} g
          </p>
        </div>
      ))}

      <p className="meal-cal">Calories: {meal.calories} kcal</p>
    </div>
  );
};

/* ===============================
   DIET PLAN PAGE
================================ */
const DietPlan = () => {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDietPlan = async () => {
      try {
        const res = await api.get("/diet-plan");
        console.log("DIET PLAN RESPONSE:", res.data);
        setDiet(res.data);
      } catch (err) {
        console.error("Failed to load diet plan", err);
      } finally {
        setLoading(false);
      }
    };

    loadDietPlan();
  }, []);

  /* ===============================
     FULL SCREEN LOADER
  ================================= */
  if (loading) {
    return (
      <FullScreenLoader
        title="Preparing your diet plan 🍽️"
        subtitle="Calculating meals & macros..."
      />
    );
  }

  /* ===============================
     ERROR FALLBACK
  ================================= */
  if (!diet) {
    return (
      <>
        <Navbar />
        <h2 style={{ color: "red", textAlign: "center", marginTop: "40px" }}>
          Failed to load diet plan
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="diet-bg">
        <h2 className="diet-title">
          🥗 Your Diet Plan ({diet.preference})
        </h2>

        <MealCard title="Breakfast" meal={diet.breakfast} />
        <MealCard title="Lunch" meal={diet.lunch} />
        <MealCard title="Snacks" meal={diet.snacks} />
        <MealCard title="Dinner" meal={diet.dinner} />
      </div>
    </>
  );
};

export default DietPlan;
