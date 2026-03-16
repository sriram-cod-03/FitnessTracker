import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan-meal', auth, async (req, res) => {
    try {
        const { base64Image } = req.body;

        if (!base64Image) {
            return res.status(400).json({ message: "No image provided" });
        }

        /** * ✅ CRITICAL FIX: Initialize inside the route.
         * This forces the code to use the live Render environment variable 
         * every time the function is called.
         */
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
            Analyze this food image. Identify the meal and estimate its nutritional content.
            Return a JSON object with these exact keys:
            {
                "name": "string",
                "calories": number,
                "protein": number,
                "carbs": number,
                "fats": number,
                "fiber": number
            }
            Only return the JSON object.
        `;

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg"
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

        if (error.message.includes("API key")) {
            return res.status(500).json({ 
                message: "Invalid API Key. Check Render Environment variables." 
            });
        }

        res.status(500).json({ 
            message: "AI failed to process. Try a smaller/clearer photo." 
        });
    }
});

export default router;