import express from "express";
import protect from "../middleware/authMiddleware.js";
import Profile from "../models/Profile.js";
import { foodNutrition } from "../utils/foodNutrition.js";

const router = express.Router();

const dietMap = {
  veg: {
    breakfast: ["Oats", "Milk", "Fruits"],
    lunch: ["Rice", "Dal", "Vegetables"],
    snacks: ["Banana", "Nuts"],
    dinner: ["Chapati", "Paneer", "Vegetables"],
  },
  egg: {
    breakfast: ["Oats", "Milk", "Eggs"],
    lunch: ["Rice", "Dal", "Vegetables"],
    snacks: ["Banana", "Nuts"],
    dinner: ["Chapati", "EggBhurji", "Vegetables"],
  },
  nonveg: {
    breakfast: ["Oats", "Milk", "Eggs"],
    lunch: ["Rice", "ChickenBreast", "Vegetables"],
    snacks: ["Banana", "Nuts"],
    dinner: ["Chapati", "Fish", "Vegetables"],
  },
};

const buildMeal = (items, ratio, totalCalories) => ({
  calories: Math.round(totalCalories * ratio),
  items: items.map((name) => ({
    name,
    ...(foodNutrition[name] || { protein: 0, carbs: 0, fats: 0, fiber: 0, grams: 100 }),
  })),
});

// ✅ GET /api/diet-plan/
router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const pref = profile.dietPreference || "veg";
    const diet = dietMap[pref];
    const totalCal = profile.calories || 2000;

    res.json({
      preference: pref,
      breakfast: buildMeal(diet.breakfast, 0.25, totalCal),
      lunch: buildMeal(diet.lunch, 0.35, totalCal),
      snacks: buildMeal(diet.snacks, 0.15, totalCal),
      dinner: buildMeal(diet.dinner, 0.25, totalCal),
    });
  } catch (error) {
    console.error("Diet Plan Error:", error);
    res.status(500).json({ message: "Error generating plan" });
  }
});

export default router;