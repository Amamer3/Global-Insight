const express = require("express");
const axios = require("axios");
const router = express.Router();

// Corrected the NEWS_API_URL to use template literals for API key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${process.env.NEWS_API_KEY}`;

// Get News by Type
router.get("/news", async (req, res) => {
    try {
        const { country = "us", category = "general", type = "latest" } = req.query;

        let newsCategory = category;
        if (type === "breaking") {
            newsCategory = "breaking-news"; // Handle breaking news type
        } else if (type === "trending") {
            newsCategory = "trending"; // Handle trending news type (Note: You may need to adjust this depending on your API or fetch logic)
        }

        const response = await axios.get(`${NEWS_API_URL}`, {
            params: {
                apiKey: process.env.NEWS_API_KEY,
                country,
                category: newsCategory,
            },
        });

        res.json(response.data.articles);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

module.exports = router;
