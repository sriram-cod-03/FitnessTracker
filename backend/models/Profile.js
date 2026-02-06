import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activityLevel: String,
  goal: String,

  dietPreference: {
    type: String,
    enum: ["veg", "egg", "nonveg"],
    default: "veg",
  },

  bmr: Number,
  tdee: Number,
  calories: Number,
  protein: Number,
  carbs: Number,
  fiber: Number,
});

export default mongoose.model("Profile", profileSchema);
