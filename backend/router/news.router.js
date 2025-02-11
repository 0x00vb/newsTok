// routes/news.js
const express = require('express');
const router = express.Router();

// Import the news controller
const newsController = require('../controller/news.controller.js');

// Define the route to get news
router.get('/', newsController.getNews);

module.exports = router;
