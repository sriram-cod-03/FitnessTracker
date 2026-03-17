import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/authMiddleware.js';
import Food from '../models/Food.js'; // Imports your Food model

const router = express.Router();

router.post('/scan-meal', auth, async (req, res) => {
    try {
        const { base64Image } = req.body;
        if (!base64Image) return res.status(400).json({ message: "No image provided" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // ✅ FIX: Full model path avoids 404/500 errors on Render
        const model = genAI.getGenerativeModel({ 
            model: "models/gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Identify food and return ONLY JSON: {"name": string, "calories": number, "protein": number, "carbs": number, "fats": number, "fiber": number}`;

        const result = await model.generateContent([
            prompt, 
            { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
        ]);

        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const aiData = JSON.parse(cleanJson);

        // ✅ AUTO-SAVE: Matches your specific schema fields
        const newFood = new Food({
            ...aiData,
            user: req.user._id, // Assigns current user
            date: new Date().toISOString().split('T')[0] // Formats as YYYY-MM-DD string
        });

        await newFood.save();
        res.json(newFood); 

    } catch (error) {
        console.error("AI Scanning Error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

export default router;