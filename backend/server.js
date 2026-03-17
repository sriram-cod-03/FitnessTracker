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
import dietPlanRoutes from './routes/dietPlanRoutes.js'; // ✅ Added

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ✅ REGISTER ROUTES
app.use('/api/auth', authRoutes);     
app.use('/api/user', userRoutes);     
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/diet-plan', dietPlanRoutes); // ✅ Added route prefix

// Root health check to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is Live and Running! 🚀');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));