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
            category = "general"; // Adjust category for breaking news
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

        // Map articles to include consistent field names
        const articles = response.data.articles.map((article) => ({
            title: article.title || "Untitled",
            body: article.description || "No description available.",
            url: article.url || "#",
            imageUrl: article.urlToImage || "https://via.placeholder.com/300x200",
        }));

        res.json(articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news." });
    }
});

module.exports = router;