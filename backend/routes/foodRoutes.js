import express from "express";
import axios from "axios";
import qs from "qs"; 
import Food from "../models/Food.js"; 
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/** * ✅ AUTHENTICATION HELPER
 * Gets an OAuth 2.0 token. 
 */
const getFatSecretToken = async () => {
  try {
    // Check if keys exist to prevent crashing
    if (!process.env.FATSECRET_CLIENT_ID || !process.env.FATSECRET_CLIENT_SECRET) {
        throw new Error("Missing FatSecret API Keys in Environment");
    }

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
    console.error("FATSECRET AUTH ERROR:", error.response?.data || error.message);
    throw new Error("Failed to authenticate with FatSecret");
  }
};

/* ===============================
    🔍 SEARCH GLOBAL FOODS
================================ */
router.get("/search", protect, async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Search query is required" });

  try {
    const token = await getFatSecretToken();
    
    const searchResponse = await axios.get("https://platform.fatsecret.com/rest/server.api", {
      params: {
        method: "foods.search",
        search_expression: query,
        format: "json",
        max_results: 5,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    const foodResults = searchResponse.data.foods.food;
    if (!foodResults) return res.json([]);

    const detailedFoods = await Promise.all(
      (Array.isArray(foodResults) ? foodResults : [foodResults]).map(async (f) => {
        try {
            const detailResponse = await axios.get("https://platform.fatsecret.com/rest/server.api", {
              params: {
                method: "food.get.v2",
                food_id: f.food_id,
                format: "json",
              },
              headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ SAFETY FIX: Check if servings exist before reading [0]
            const servings = detailResponse.data.food.servings?.serving;
            if (!servings) return null;

            const serving = Array.isArray(servings) ? servings[0] : servings;

            return {
              name: detailResponse.data.food.food_name,
              calories: Math.round(serving.calories || 0),
              protein: Math.round(serving.protein || 0),
              carbs: Math.round(serving.carbohydrate || 0),
              fats: Math.round(serving.fat || 0),
              fiber: Math.round(serving.fiber || 0),
              image: "https://cdn.fatsecret.com/static/images/default_food.png", 
            };
        } catch (err) {
            return null; // Skip items that cause errors
        }
      })
    );

    // Filter out any null results
    res.status(200).json(detailedFoods.filter(item => item !== null));
  } catch (error) {
    console.error("SEARCH CRASH:", error.message);
    res.status(500).json({ message: error.message || "Global search failed." });
  }
});

/* ===============================
    🍎 CRUD ROUTES
================================ */

// ADD FOOD
router.post("/", protect, async (req, res) => {
  try {
    const food = await Food.create({
      ...req.body,
      user: req.user._id,
      date: req.body.date || new Date().toISOString().split("T")[0],
    });
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Failed to add food" });
  }
});

// GET TODAY'S LOG
router.get("/today", protect, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const foods = await Food.find({ user: req.user._id, date: today }).sort({ createdAt: -1 });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch log" });
  }
});

// ✅ ADDED: UPDATE FOOD (Required for FoodList.jsx)
router.put("/:id", protect, async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);
      if (!food || food.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      Object.assign(food, req.body);
      await food.save();
      res.json(food);
    } catch (error) {
      res.status(500).json({ message: "Update failed" });
    }
});

// ✅ ADDED: DELETE FOOD (Required for FoodList.jsx)
router.delete("/:id", protect, async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);
      if (!food || food.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }
      await food.deleteOne();
      res.json({ message: "Removed" });
    } catch (error) {
      res.status(500).json({ message: "Delete failed" });
    }
});

export default router;