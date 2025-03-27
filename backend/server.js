import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Enable 'require' in ES module
const require = createRequire(import.meta.url);

// Load Firebase credentials
const serviceAccount = require("./serviceAccountKey.json");

// Ensure FIREBASE_DATABASE_URL is set
if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("Missing FIREBASE_DATABASE_URL in .env");
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
  console.log("Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  process.exit(1);
}

// Create an Express app
const app = express();

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in JSON parser

// Serve Static Files (HTML, CSS, JS) 
app.use(express.static(path.join(__dirname, "../")));
app.use(express.static(path.join(__dirname, "../frontend")));

// Use Routes
app.use("/", userRoutes);
app.use("/", authRoutes);

// Serve index.html at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});



// Set PORT and Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
