// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler.middleware');
const authRoutes = require('./routes/auth.routes'); // 1. Import auth routes

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

// 2. Mount auth API endpoints
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('NETRA API is running smoothly...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server booting up on port ${PORT} in production mode`);
});