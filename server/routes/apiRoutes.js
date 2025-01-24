const express = require("express");
const axios = require("axios");
const router = express.Router();

// Primary News API (The NewsAPI)
const PRIMARY_NEWS_API_URL = "https://api.thenewsapi.com/v1/news/all";

// Secondary News API (NewsAPI.org)
const SECONDARY_NEWS_API_URL = "https://newsapi.org/v2/everything";

// Tertiary News API (NewsData.io)
const TERTIARY_NEWS_API_URL = "https://newsdata.io/api/1/news";

// Get News by Type
router.get("/news", async (req, res) => {
    try {
        const { type = "latest" } = req.query;

        // Fetch data from all APIs
        const primaryArticles = await fetchFromPrimaryAPI(type);
        const secondaryArticles = await fetchFromSecondaryAPI(type);
        const tertiaryArticles = await fetchFromTertiaryAPI(type);

        // Combine the results (remove duplicates if necessary)
        const combinedArticles = [
            ...(primaryArticles || []),
            ...(secondaryArticles || []),
            ...(tertiaryArticles || []),
        ];

        // If no articles are found, return an error
        if (combinedArticles.length === 0) {
            throw new Error("No news articles found.");
        }

        res.json(combinedArticles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news." });
    }
});

// Fetch news from the primary API (The NewsAPI)
async function fetchFromPrimaryAPI(type) {
    try {
        const response = await axios.get(PRIMARY_NEWS_API_URL, {
            params: {
                api_token: process.env.PRIMARY_NEWS_API_KEY,
                locale: "us",
                language: "en",
                limit: 10,
            },
        });

        return response.data.data.map((article) => ({
            title: article.title || "Untitled",
            body: article.description || "No description available.",
            url: article.url || "#",
            imageUrl: article.image_url || "https://via.placeholder.com/300x200",
        }));
    } catch (error) {
        console.error("Primary API failed:", error.message);
        return null; // Return null if the primary API fails
    }
}

// Fetch news from the secondary API (NewsAPI.org)
async function fetchFromSecondaryAPI(type) {
    try {
        const response = await axios.get(SECONDARY_NEWS_API_URL, {
            params: {
                apiKey: process.env.SECONDARY_NEWS_API_KEY, // Correct parameter for NewsAPI.org
                q: type === "breaking" ? "breaking" : type === "trending" ? "trending" : "news",
                language: "en",
                pageSize: 10,
            },
        });

        return response.data.articles.map((article) => ({
            title: article.title || "Untitled",
            body: article.description || "No description available.",
            url: article.url || "#",
            imageUrl: article.urlToImage || "https://via.placeholder.com/300x200",
        }));
    } catch (error) {
        console.error("Secondary API failed:", error.message);
        return null; // Return null if the secondary API fails
    }
}

// Fetch news from the tertiary API (NewsData.io)
async function fetchFromTertiaryAPI(type) {
    try {
        const response = await axios.get(TERTIARY_NEWS_API_URL, {
            params: {
                apikey: process.env.TERTIARY_NEWS_API_KEY,
                q: type === "breaking" ? "breaking" : type === "trending" ? "trending" : "news",
                country: "us",
                language: "en",
                limit: 10,
            },
        });

        return response.data.results.map((article) => ({
            title: article.title || "Untitled",
            body: article.description || "No description available.",
            url: article.link || "#",
            imageUrl: article.image_url || "https://via.placeholder.com/300x200",
        }));
    } catch (error) {
        console.error("Tertiary API failed:", error.message);
        return null; // Return null if the tertiary API fails
    }
}

module.exports = router;