import express from "express";
import axios from "axios";
import Food from "../models/Food.js"; 
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
    🔍 GLOBAL SEARCH (Edamam API Version)
    GET /api/foods/search?query=mutton
   ============================================================ */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;

  // Prevent caching so you always see your code changes immediately
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const response = await axios.get("https://api.food-database/v2/parser", {
      params: {
        app_id: process.env.EDAMAM_APP_ID,
        app_key: process.env.EDAMAM_APP_KEY,
        ingr: query,
        "nutrition-type": "logging"
      }
    });

    const hints = response.data.hints;
    if (!hints || hints.length === 0) return res.json([]);

    // Extracting nutrients - specifically adding FIBTG (Fiber)
    const results = hints.map((item) => {
      const f = item.food;
      const n = f.nutrients;

      return {
        name: f.label,
        calories: Math.round(n.ENERC_KCAL || 0),
        protein: Math.round(n.PROCNT || 0),
        carbs: Math.round(n.CHOCDF || 0),
        fats: Math.round(n.FAT || 0),
        fiber: Math.round(n.FIBTG || 0), // ✅ This fixes your Postman issue
        image: f.image || "https://cdn-icons-png.flaticon.com/512/706/706164.png"
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Edamam Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch results from Edamam." });
  }
});

/* ============================================================
    🍎 LOGGING (Save Food to MongoDB)
    POST /api/foods
   ============================================================ */
router.post("/", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const food = await Food.create({
      ...req.body,
      user: req.user._id,
      date: req.body.date || today,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to log food entry." });
  }
});

/* ============================================================
    📊 HISTORY (Fetch Today's Log)
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
    res.status(500).json({ message: "Failed to fetch logs." });
  }
});

/* ============================================================
    🗑️ DELETE
    DELETE /api/foods/:id
   ============================================================ */
router.delete("/:id", protect, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food || food.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    await food.deleteOne();
    res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Delete failed." });
  }
});

export default router;