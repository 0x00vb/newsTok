// server.js
const express = require('express');
const cors = require('cors');

// Import the news router
const newsRouter = require('./router/news.router');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Use the news router for /api/news endpoints
app.use('/api/news', newsRouter);

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Newstok Backend is running.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
