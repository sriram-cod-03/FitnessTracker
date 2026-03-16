import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes - MUST include .js extension in ES Modules
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import dietPlanRoutes from './routes/dietPlanRoutes.js';
import aiRoutes from './routes/aiRoutes.js'; 

dotenv.config();
// Temporary debug log
console.log("Checking GEMINI_API_KEY...");
if (process.env.GEMINI_API_KEY) {
    console.log("Key found: ", process.env.GEMINI_API_KEY.substring(0, 5) + "..."); 
} else {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is undefined! Check your .env file location.");
}

const app = express();

// Middleware
app.use(cors());
// Increased limit to handle Base64 images for the AI scanner
app.use(express.json({ limit: '10mb' })); 

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/diet-plan', dietPlanRoutes);
app.use('/api/ai', aiRoutes); 
// limit 50mb
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected (ES Module Mode)'))
    .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));