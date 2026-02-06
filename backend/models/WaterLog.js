import mongoose from "mongoose";

const waterLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    water: {
      type: Number, // in ml
      default: 0,
    },
    steps: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WaterLog", waterLogSchema);
