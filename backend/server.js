import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());

/** * ✅ CRITICAL FIX: Increase limits to prevent 413 and 500 errors 
 * when uploading food images.
 */
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Register AI Routes
app.use('/api/auth', authRoutes);
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