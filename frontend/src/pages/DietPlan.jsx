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

  // ✅ CALCULATE MEAL TOTALS: Sums up all macros for this specific meal
  const mealTotals = meal.items.reduce((acc, item) => ({
    pro: acc.pro + (item.protein || 0),
    carb: acc.carb + (item.carbs || 0),
    fat: acc.fat + (item.fats || 0),
    fib: acc.fib + (item.fiber || 0)
  }), { pro: 0, carb: 0, fat: 0, fib: 0 });

  return (
    <div className="diet-card">
      <h3 className="meal-header">{title}</h3>

      {meal.items.map((item, index) => (
        <div key={index} className="food-row">
          <div className="food-name">
            <strong>{item.name}</strong>
            <span className="grams"> ({item.grams}g)</span>
          </div>

          <p className="macros">
            Protein: {item.protein}g | Carbs: {item.carbs}g | Fats: {item.fats}g | Fiber: {item.fiber}g
          </p>
        </div>
      ))}

      {/* ✅ MEAL SUMMARY FOOTER: Displays the aggregated macros */}
      <div className="meal-summary-footer">
        <div className="macro-totals">
          <span>P: <strong>{mealTotals.pro}g</strong></span>
          <span>C: <strong>{mealTotals.carb}g</strong></span>
          <span>F: <strong>{mealTotals.fat}g</strong></span>
          <span>Fib: <strong>{mealTotals.fib}g</strong></span>
        </div>
        <div className="meal-cal">Total: {meal.calories} kcal</div>
      </div>
    </div>
  );
};

/* ===============================
   MAIN DIET PLAN PAGE
================================ */
const DietPlan = () => {
  const [diet, setDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDietPlan = async () => {
      try {
        const res = await api.get("/diet-plan");
        setDiet(res.data);
      } catch (err) {
        console.error("Failed to load diet plan", err);
      } finally {
        setLoading(false);
      }
    };

    loadDietPlan();
  }, []);

  if (loading) {
    return (
      <FullScreenLoader
        title="Preparing your diet plan 🍽️"
        subtitle="Calculating meals & macros..."
      />
    );
  }

  if (!diet) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <h2 style={{ color: "red" }}>Failed to load diet plan</h2>
          <p className="text-white">Please ensure your profile is set up correctly.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="diet-bg">
        <div className="diet-container">
          <h2 className="diet-title">Your Daily Diet Plan ({diet.preference})</h2>

          <MealCard title="Breakfast" meal={diet.breakfast} />
          <MealCard title="Lunch" meal={diet.lunch} />
          <MealCard title="Snacks" meal={diet.snacks} />
          <MealCard title="Dinner" meal={diet.dinner} />
        </div>
      </div>
    </>
  );
};

export default DietPlan;