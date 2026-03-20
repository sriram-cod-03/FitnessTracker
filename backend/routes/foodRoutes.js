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

  // Force fresh data to avoid browser caching issues
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

    // Map Edamam's data structure to your app's format
    const results = hints.map((item) => {
      const f = item.food;
      const n = f.nutrients; // Accessing the nutrients object

      return {
        name: f.label,
        calories: Math.round(n.ENERC_KCAL || 0),
        protein: Math.round(n.PROCNT || 0),
        carbs: Math.round(n.CHOCDF || 0),
        fats: Math.round(n.FAT || 0),
        fiber: Math.round(n.FIBTG || 0), // ✅ Fiber (FIBTG) is now included
        image: f.image || "https://cdn-icons-png.flaticon.com/512/706/706164.png"
      };
    });

    res.status(200).json(results);
  } catch (error) {
    // Logging the specific error from Edamam to your terminal/Render logs
    console.error("❌ Edamam API Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch results from global database." });
  }
});

/* ============================================================
    🍎 LOGGING (Save Food to MongoDB)
    POST /api/foods
   ============================================================ */
router.post("/", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const food = await Food.create({
      ...req.body, // This will include the 'fiber' sent from frontend
      user: req.user._id,
      date: req.body.date || today,
    });

    res.status(201).json(food);
  } catch (error) {
    console.error("❌ Log Error:", error.message);
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

    if (!food) {
      return res.status(404).json({ message: "Food entry not found." });
    }

    // Ensure the food belongs to the logged-in user
    if (food.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this." });
    }

    await food.deleteOne();
    res.status(200).json({ message: "Deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed." });
  }
});

export default router;