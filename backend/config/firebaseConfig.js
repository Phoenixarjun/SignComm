import admin from "firebase-admin";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv"; // Load environment variables

dotenv.config();

// Use `createRequire` to load JSON files in ES modules
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase service account key (Ensure this file exists in the correct location)
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
const serviceAccount = require(serviceAccountPath);

// Ensure `FIREBASE_DATABASE_URL` is set
if (!process.env.FIREBASE_DATABASE_URL) {
  console.error("Missing FIREBASE_DATABASE_URL in .env");
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL, // Ensure this is correct
  });
  console.log("✅ Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("🔥 Firebase initialization failed:", error);
  process.exit(1);
}

export default admin;
