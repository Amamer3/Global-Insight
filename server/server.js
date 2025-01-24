const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5502;

// CORS Configuration
const corsOptions = {
    origin: ["http://127.0.0.1:5502", "http://localhost:5502"], // Allow requests from these origins
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (e.g., cookies)
};

// Middleware
app.use(cors(corsOptions)); // Use CORS with the configured options
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Global Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Server Listening
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
    });
});

process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => {
        console.log("HTTP server closed");
    });
});