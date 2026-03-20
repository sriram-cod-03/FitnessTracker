import express from "express";
import axios from "axios";
import Food from "../models/Food.js"; 
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
    🔍 GLOBAL SEARCH (Edamam API Version)
    GET /api/foods/search?query=chicken
   ============================================================ */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;

  // Force fresh data and prevent the browser from using old "304" cache
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Calling the Edamam Food Database API
    const response = await axios.get("https://api.edamam.com/api/food-database/v2/parser", {
      params: {
        app_id: process.env.EDAMAM_APP_ID,
        app_key: process.env.EDAMAM_APP_KEY,
        ingr: query,
        "nutrition-type": "logging"
      }
    });

    const hints = response.data.hints;
    if (!hints || hints.length === 0) return res.json([]);

    // Map Edamam's data structure to your app's standard format
    const results = hints.map((item) => {
      const f = item.food;
      return {
        name: f.label,
        calories: Math.round(f.nutrients.ENERC_KCAL || 0),
        protein: Math.round(f.nutrients.PROCNT || 0),
        carbs: Math.round(f.nutrients.CHOCDF || 0),
        fats: Math.round(f.nutrients.FAT || 0),
        image: f.image || "https://cdn-icons-png.flaticon.com/512/706/706164.png"
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Edamam Search Error:", error.message);
    res.status(500).json({ message: "Failed to fetch results from Edamam." });
  }
});

/* ============================================================
    🍎 LOGGING (Add Food to Personal Log)
    POST /api/foods
   ============================================================ */
router.post("/", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const food = await Food.create({
      ...req.body,
      user: req.user._id, // Set from protect middleware
      date: req.body.date || today,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to log food entry." });
  }
});

/* ============================================================
    📊 DAILY LOG (Fetch User's Food for Today)
    GET /api/foods/today
   ============================================================ */
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const foods = await Food.find({
      user: req.user._id,
      date: today,
    }).sort({ createdAt: -1 });

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch today's logs." });
  }
});

/* ============================================================
    🗑️ DELETE ENTRY
    DELETE /api/foods/:id
   ============================================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food || food.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this." });
    }

    await food.deleteOne();
    res.status(200).json({ message: "Food removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed." });
  }
});

export default router;