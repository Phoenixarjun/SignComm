import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../../frontend/components");

// Serve index.html when "/" is accessed
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicDir });
});

// Login Page
router.get("/login", (req, res) => {
  res.sendFile("login.html", { root: publicDir });
});

// Register Page
router.get("/register", (req, res) => {
  res.sendFile("register.html", { root: publicDir });
});

// Contribute Page
router.get("/contribute", (req, res) => {
  res.sendFile("contribute.html", { root: publicDir });
});

// Sign Page
router.get("/sign", (req, res) => {
  res.sendFile("sign.html", { root: publicDir });
});


// Register Page
router.get("/learn", (req, res) => {
  res.sendFile("learn.html", { root: publicDir });
});

// Handle Email Sign-in
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    res.json({ success: true, message: "Login successful", user, redirect: "/home" });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Handle Email Registration
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    res.json({ success: true, message: "User registered successfully", user: userRecord, redirect: "/home" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Google Sign-In (Dummy)
router.get("/auth/google", async (req, res) => {
  return res.json({ success: true, message: "Google sign-in successful" });
});

// Facebook Sign-In (Dummy)
router.get("/auth/facebook", async (req, res) => {
  return res.json({ success: true, message: "Facebook sign-in successful" });
});

export default router;
