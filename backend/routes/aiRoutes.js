import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import auth from '../middleware/authMiddleware.js'; // Ensure the .js extension is present

const router = express.Router();

/**
 * INITIALIZE GEMINI AI
 * Uses the key from your .env file
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @route   POST /api/ai/scan-meal
 * @desc    Analyzes an image and returns nutritional macros
 * @access  Private
 */
router.post('/scan-meal', auth, async (req, res) => {
    try {
        const { base64Image } = req.body;

        // 1. Validation
        if (!base64Image) {
            return res.status(400).json({ message: "No image provided" });
        }

        // 2. Setup the Model
        // We use gemini-1.5-flash because it is optimized for speed and vision
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // Force the AI to return data in JSON format
            generationConfig: { responseMimeType: "application/json" }
        });

        // 3. Prepare the Prompt
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

        // 4. Generate Content from Gemini
        const result = await model.generateContent([prompt, imagePart]);
        const responseText = await result.response.text();

        // 5. Clean & Parse JSON
        // AI sometimes wraps JSON in ```json ... ``` blocks. This removes them.
        const cleanJson = responseText.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanJson);

        // 6. Return Data to Frontend
        res.json(parsedData);

    } catch (error) {
        console.error("AI Scanning Error:", error.message);

        // Check for specific API Key issues
        if (error.message.includes("API key")) {
            return res.status(500).json({ 
                message: "AI scanning failed. Please check your API key." 
            });
        }

        res.status(500).json({ 
            message: "AI failed to process the image. Please try again." 
        });
    }
});

export default router;