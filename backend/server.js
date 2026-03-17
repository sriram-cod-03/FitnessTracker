import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Route Imports (Matching your Explorer structure)
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());

/** * ✅ Payload limits reset to standard (1mb) 
 * Large 50mb limits are no longer needed without the AI scanner.
 */
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ✅ REGISTER ROUTES
app.use('/api/auth', authRoutes);     // Handles Login/Signup
app.use('/api/user', userRoutes);     // Handles user profile data
app.use('/api/profile', profileRoutes); // Handles fitness stats
app.use('/api/foods', foodRoutes);     // Handles food logs
app.use('/api/water', waterRoutes);     // Handles hydration logs

// Root health check
app.get('/', (req, res) => {
  res.send('Fitness Tracker API (Scanner Removed) is Live! 🚀');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));