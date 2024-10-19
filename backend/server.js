import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors middleware
import calculatorRoutes from './routes/Calculator.route.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Parse JSON request bodies

// CORS Configuration
app.use(cors({ origin: 'http://localhost:5001' })); // Allow requests from localhost:3000

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the calculator routes
app.use('/api/calculator', calculatorRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
