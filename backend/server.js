import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Route imports
import aiRoutes from './routes/aiRoutes.js';
import userRoutes from './routes/userRoutes.js';
// ... other imports

dotenv.config();
const app = express();

app.use(cors());

// ✅ FIX: Increase limits for Base64 image strings
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ ROOT ROUTE: Prevents "Cannot GET /" errors on Render
app.get('/', (req, res) => {
  res.send('Fitness Tracker API is Live! 🚀');
});

app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes); 
// ... other route registrations

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected ✅'))
    .catch(err => console.error('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));