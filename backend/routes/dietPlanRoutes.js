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
    ...(foodNutrition[name] || {}),
  })),
});

router.get("/", protect, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  const pref = profile.dietPreference || "veg";
  const diet = dietMap[pref];

  res.json({
    preference: pref,
    breakfast: buildMeal(diet.breakfast, 0.25, profile.calories),
    lunch: buildMeal(diet.lunch, 0.35, profile.calories),
    snacks: buildMeal(diet.snacks, 0.15, profile.calories),
    dinner: buildMeal(diet.dinner, 0.25, profile.calories),
  });
});

export default router;
