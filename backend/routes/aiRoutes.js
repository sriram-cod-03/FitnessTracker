const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware'); //

// Initialize Gemini (Ensure your API Key is in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/scan-meal', auth, async (req, res) => {
    try {
        const { base64Image } = req.body;
        if (!base64Image) return res.status(400).json({ message: "No image provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // System prompt to force JSON response
        const prompt = `Analyze this food image. Identify items and estimate their nutritional value (portion sizes). 
        Return ONLY a JSON object with these fields: 
        { "name": String, "calories": Number, "protein": Number, "carbs": Number, "fats": Number, "fiber": Number }`;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        
        // Clean and parse the response
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const foodData = JSON.parse(cleanJson);

        res.json(foodData);
    } catch (error) {
        console.error("AI Scan Error:", error);
        res.status(500).json({ message: "AI failed to process image" });
    }
});

module.exports = router;