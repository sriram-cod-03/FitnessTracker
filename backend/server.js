import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Ensure this exists for /api/user

dotenv.config();
const app = express();

// Middleware
app.use(cors());

// ✅ CRITICAL FIX: Increase limits for AI image scanning Base64 strings
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ ROOT ROUTE: Fixes "Cannot GET /" on Render
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is Live and Running! 🚀');
});

// ✅ REGISTER ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes); // Matches Dashboard calls to /api/user/profile
app.use('/api/profile', profileRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/ai', aiRoutes); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('DB Error ❌:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));