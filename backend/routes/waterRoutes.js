import express from "express";
import protect from "../middleware/authMiddleware.js";
import WaterLog from "../models/WaterLog.js";

const router = express.Router();

const today = new Date().toISOString().split("T")[0];


// GET today water + steps
router.get("/today", protect, async (req, res) => {
  let log = await WaterLog.findOne({ user: req.user._id, date: today });

  if (!log) {
    log = await WaterLog.create({
      user: req.user._id,
      date: today,
    });
  }

  res.json(log);
});


// ADD water
router.post("/add-water", protect, async (req, res) => {
  const { amount } = req.body;

  let log = await WaterLog.findOne({ user: req.user._id, date: today });

  if (!log) {
    log = new WaterLog({ user: req.user._id, date: today });
  }

  log.water += amount;
  await log.save();

  res.json(log);
});


// UPDATE steps
router.post("/steps", protect, async (req, res) => {
  const { steps } = req.body;

  let log = await WaterLog.findOne({ user: req.user._id, date: today });

  if (!log) {
    log = new WaterLog({ user: req.user._id, date: today });
  }

  log.steps = steps;
  await log.save();

  res.json(log);
});

export default router;
