import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import aiRoutes from './routes/aiRoutes.js'; 

dotenv.config();
const app = express();

// Middleware
app.use(cors());

/** * ✅ FIX FOR 413 & 500 ERRORS: 
 * Increase JSON payload limit to handle Base64 image strings.
 */
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected (ES Module)'))
    .catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));