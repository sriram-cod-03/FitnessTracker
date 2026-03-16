import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/scan-meal", auth, async (req, res) => {
  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Initialize with your Render environment key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    /** * ✅ CRITICAL FIX FOR 404 ERROR:
     * Use "models/gemini-1.5-flash" to ensure the SDK finds the correct endpoint.
     */
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash", // Added 'models/' prefix
    });
    const prompt = `
            Analyze this food image. Identify the meal and estimate its nutritional content.
            Return ONLY a JSON object:
            {
                "name": "string",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fats": number,
                "fiber": number
            }
        `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();

    // Standard cleaning to prevent JSON.parse errors
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanJson);

    res.json(parsedData);
  } catch (error) {
    console.error("AI Scanning Error:", error.message);

    // Return the specific error message to help debug in the browser console
    res.status(500).json({ message: error.message });
  }
});

export default router;
