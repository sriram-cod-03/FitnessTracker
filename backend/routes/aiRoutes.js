import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan-meal', auth, async (req, res) => {
    try {
        const { base64Image } = req.body;
        if (!base64Image) return res.status(400).json({ message: "No image provided" });

        // ✅ FIX 1: Initialize inside the route to ensure Render environment variables are ready
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // ✅ FIX 2: Use the full resource path 'models/gemini-1.5-flash' to avoid 404/500 errors
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
        
        // ✅ FIX 3: Robust cleaning of the response string
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        res.json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("AI Scanning Error:", error.message);
        // Return the specific error message to help identify if it's a key issue
        res.status(500).json({ message: error.message });
    }
});

export default router;