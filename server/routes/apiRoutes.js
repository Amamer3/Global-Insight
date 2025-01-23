const express = require("express");
const axios = require("axios");
const router = express.Router();

// Base News API URL
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

// Get News by Type
router.get("/news", async (req, res) => {
    try {
        const { type = "latest" } = req.query;
        let category = "general";

        if (type === "breaking") {
            category = "general"; // Update to the correct category for breaking news
        } else if (type === "trending") {
            category = "general"; // Adjust if "trending" is not valid
        }

        const response = await axios.get(NEWS_API_URL, {
            params: {
                apiKey: process.env.NEWS_API_KEY,
                country: "us", // Default country
                category, // Mapped category
            },
        });

        res.json(response.data.articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news." });
    }
});


module.exports = router;
