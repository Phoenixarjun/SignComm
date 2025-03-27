import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../"); // Root directory where index.html is
const publicDir = path.resolve(__dirname, "../../frontend/components"); // Public directory for other HTML files

console.log("Serving index.html from:", rootDir);
console.log("Serving static files from:", publicDir);

// User Dashboard (Home Page)
router.get("/home", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html")); // Serve index.html from root
});

// Sign Page
router.get("/sign", (req, res) => {
  res.sendFile(path.join(publicDir, "sign.html"));
});

// Learn Page
router.get("/sign-learn", (req, res) => {
  res.sendFile(path.join(publicDir, "learn.html"));
});

// Get User Info
router.get("/user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return res.json({ success: true, user: decodedToken });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
      const userRef = admin.firestore().collection("users").doc(userId);
      const doc = await userRef.get();

      if (!doc.exists) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const userData = doc.data();
      res.json({ success: true, user: userData });
  } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});


// Logout User
router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/api/auth/login");
});

export default router;
