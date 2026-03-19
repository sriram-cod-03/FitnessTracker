import express from "express";
import axios from "axios";
import qs from "qs"; 
import Food from "../models/Food.js"; 
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * ✅ FATSECRET AUTHENTICATION HELPER
 * Obtains an OAuth2 token for the global search API.
 */
const getFatSecretToken = async () => {
  try {
    const credentials = Buffer.from(
      `${process.env.FATSECRET_CLIENT_ID}:${process.env.FATSECRET_CLIENT_SECRET}`
    ).toString("base64");

    const response = await axios.post(
      "https://oauth.fatsecret.com/connect/token",
      qs.stringify({ grant_type: "client_credentials", scope: "basic" }),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("FatSecret Auth Error:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with food database");
  }
};

/* ============================================================
    🔍 GLOBAL SEARCH (Navbar/SearchPage)
    GET /api/foods/search
   ============================================================ */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;
  
  // Force browser to fetch fresh data every time (Prevents 304 errors)
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

  if (!query) return res.status(400).json({ message: "Search query is required" });

  try {
    const token = await getFatSecretToken();
    
    // 1. Initial Search
    const searchResponse = await axios.get("https://platform.fatsecret.com/rest/server.api", {
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json",
        max_results: 10,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const foodResults = searchResponse.data.foods?.food;
    if (!foodResults) return res.json([]);

    // 2. Map Results and Fetch Detailed Macros
    const detailedFoods = await Promise.all(
      (Array.isArray(foodResults) ? foodResults : [foodResults]).map(async (f) => {
        try {
          const detailRes = await axios.get("https://platform.fatsecret.com/rest/server.api", {
            params: { method: "food.get.v2", food_id: f.food_id, format: "json" },
            headers: { Authorization: `Bearer ${token}` },
          });

          const foodData = detailRes.data.food;
          const servings = foodData?.servings?.serving;
          if (!servings) return null;

          // FatSecret can return serving as an array OR a single object
          const s = Array.isArray(servings) ? servings[0] : servings;

          return {
            name: foodData.food_name,
            calories: Math.round(s.calories || 0),
            protein: Math.round(s.protein || 0),
            carbs: Math.round(s.carbohydrate || 0),
            fats: Math.round(s.fat || 0),
            fiber: Math.round(s.fiber || 0),
            image: "https://cdn.fatsecret.com/static/images/default_food.png", 
          };
        } catch (err) { 
          return null; 
        }
      })
    );

    res.status(200).json(detailedFoods.filter(f => f !== null));
  } catch (error) {
    console.error("Search Route Error:", error.message);
    res.status(500).json({ message: "Global search failed." });
  }
});

/* ============================================================
    🍎 FOOD LOGGING (Add Food)
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
    res.status(500).json({ message: "Failed to add food" });
  }
});

/* ============================================================
    📊 DAILY LOG (Today's Entries)
    GET /api/foods/today
   ============================================================ */
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

/* ============================================================
    📈 WEEKLY STATS (For Charts)
    GET /api/foods/weekly
   ============================================================ */
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
        fats: dayFoods.reduce((s, f) => s + (f.fats || 0), 0),
      };
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch weekly stats" });
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
      return res.status(401).json({ message: "Not authorized" });
    }

    await food.deleteOne();
    res.status(200).json({ message: "Food removed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food" });
  }
});

export default router;