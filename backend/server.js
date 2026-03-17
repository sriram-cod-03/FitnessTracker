import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports - Ensure the .js extension is present for ES modules on Render
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js'; 

dotenv.config();
const app = express();

// Middleware
app.use(cors());

/** * ✅ CRITICAL FIX FOR 500 ERRORS: 
 * These lines allow the server to receive large Base64 image strings 
 * from the AI scanner without crashing.
 */
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/** * ✅ ROOT ROUTE: 
 * Fixes the "Cannot GET /" message on Render and acts as a health check.
 */
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is Live and Running! 🚀');
});

/** * ✅ REGISTER ROUTES:
 * This mapping must match your frontend api.post calls exactly.
 * For example: api.post("/auth/login") matches app.use('/api/auth', authRoutes).
 */
app.use('/api/auth', authRoutes);     // Handles login/signup
app.use('/api/user', userRoutes);     // Handles /api/user/profile for dashboard
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes);         // Handles AI meal scanning

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('DB Connection Error ❌:', err));

// Port configuration for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});