import express from "express";
import protect from "../middleware/authMiddleware.js";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
const router = express.Router();

/*CREATE / UPDATE PROFILE POST /api/profile */
router.post("/", protect, async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, dietPreference } =
      req.body;

    // BMR
    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    // Activity multiplier
    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    const tdee = bmr * (activityMap[activityLevel] || 1.2);

    // Calories
    let calories = tdee;

    if (goal === "cut") calories -= 400;
    if (goal === "bulk") calories += 300;

    // Macros
    const protein = weight * 2;
    const fat = (calories * 0.25) / 9;
    const carbs = (calories - (protein * 4 + fat * 9)) / 4;
    const fiber = 30;

    const profileData = {
      user: req.user._id,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      dietPreference,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fiber,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true },
    );

    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile calculation failed" });
  }
});

/*GET PROFILE GET /api/profile*/

router.get("/", protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // fetch user separately
    const user = await User.findById(profile.user).select("name email");

    const response = {
      ...profile.toObject(),
      name: user.name,
      email: user.email,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/*UPDATE PROFILE PUT /api/profile*/

router.put("/", protect, async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, dietPreference } =
      req.body;

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    const tdee = bmr * (activityMap[activityLevel] || 1.2);

    let calories = tdee;

    if (goal === "cut") calories -= 400;
    if (goal === "bulk") calories += 300;

    const protein = weight * 2;
    const fat = (calories * 0.25) / 9;
    const carbs = (calories - (protein * 4 + fat * 9)) / 4;
    const fiber = 30;

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      {
        age,
        gender,
        height,
        weight,
        activityLevel,
        goal,
        dietPreference,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fiber,
      },
      { new: true },
    );

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
});

export default router;
