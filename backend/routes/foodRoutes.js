import express from "express";
import axios from "axios";
import Food from "../models/Food.js"; //
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===============================
   SEARCH FOOD (Spoonacular API)
   GET /api/foods/search
================================ */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;
  const API_KEY = process.env.SPOONACULAR_API_KEY; //

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // 1. Search for ingredient IDs
    const searchRes = await axios.get(
      `https://api.spoonacular.com/food/ingredients/search`,
      { params: { query, apiKey: API_KEY, number: 5 } }
    );

    // 2. Fetch detailed nutrition for each ID found
    const detailedResults = await Promise.all(
      searchRes.data.results.map(async (item) => {
        const info = await axios.get(
          `https://api.spoonacular.com/food/ingredients/${item.id}/information`,
          { params: { amount: 100, unit: "grams", apiKey: API_KEY } }
        );

        const nutrients = info.data.nutrition.nutrients;
        const getVal = (name) => nutrients.find((n) => n.name === name)?.amount || 0;

        return {
          name: info.data.name,
          calories: Math.round(getVal("Calories")),
          protein: Math.round(getVal("Protein")),
          carbs: Math.round(getVal("Net Carbohydrates")),
          fats: Math.round(getVal("Fat")),
          fiber: Math.round(getVal("Fiber")),
          image: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
        };
      })
    );

    res.status(200).json(detailedResults);
  } catch (error) {
    console.error("Spoonacular Error:", error.message);
    res.status(500).json({ message: "Error fetching from Spoonacular database" });
  }
});

/* ===============================
   ADD FOOD
   POST /api/foods
================================ */
router.post("/", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; //

    const food = await Food.create({
      name: req.body.name,
      calories: Number(req.body.calories),
      protein: Number(req.body.protein || 0),
      carbs: Number(req.body.carbs || 0),
      fats: Number(req.body.fats || 0),
      fiber: Number(req.body.fiber || 0),
      user: req.user._id, //
      date: req.body.date || today, //
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to add food" });
  }
});

/* ===============================
   TODAY FOODS
   GET /api/foods/today
================================ */
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    res.set("Cache-Control", "no-store");

    const foods = await Food.find({
      user: req.user._id,
      date: today,
    }).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's foods" });
  }
});

/* ===============================
   WEEKLY NUTRITION
   GET /api/foods/weekly
================================ */
router.get("/weekly", protect, async (req, res) => {
  try {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const foods = await Food.find({
      user: req.user._id,
      date: { $in: days },
    });

    const data = days.map((day) => {
      const dayFoods = foods.filter((f) => f.date === day);
      return {
        day,
        calories: dayFoods.reduce((s, f) => s + (f.calories || 0), 0),
        protein: dayFoods.reduce((s, f) => s + (f.protein || 0), 0),
        carbs: dayFoods.reduce((s, f) => s + (f.carbs || 0), 0),
        fiber: dayFoods.reduce((s, f) => s + (f.fiber || 0), 0),
      };
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weekly stats" });
  }
});

/* ===============================
   UPDATE FOOD
   PUT /api/foods/:id
================================ */
router.put("/:id", protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    food.name = req.body.name ?? food.name;
    food.calories = req.body.calories ?? food.calories;
    food.protein = req.body.protein ?? food.protein;
    food.carbs = req.body.carbs ?? food.carbs;
    food.fats = req.body.fats ?? food.fats;
    food.fiber = req.body.fiber ?? food.fiber;

    const updatedFood = await food.save();
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: "Failed to update food" });
  }
});

/* ===============================
   DELETE FOOD
   DELETE /api/foods/:id
================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await food.deleteOne();
    res.status(200).json({ message: "Food removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food" });
  }
});

export default router;