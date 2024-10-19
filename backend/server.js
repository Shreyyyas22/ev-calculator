import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors middleware
import path from 'path'; // For serving static files
import calculatorRoutes from './routes/Calculator.route.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Parse JSON request bodies

// CORS Configuration: Allow requests from localhost and Render's live frontend
const allowedOrigins = [
  'https://ev-calculator.onrender.com',  // Deployed frontend URL
  'http://localhost:3000'  // Allow localhost for development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the calculator routes
app.use('/api/calculator', calculatorRoutes);

// Serve static files from the React app
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // Ensure the 'build' folder is served correctly in production
  app.use(express.static(path.join(__dirname, 'build')));

  // Serve index.html for any request that doesn't match an API route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Port Configuration
const PORT = process.env.PORT || 5000; // Port 5000 for development; Render assigns a port in production
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
