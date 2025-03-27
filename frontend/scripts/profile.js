import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUwgD1kdv90WC6070TDH11o76LUyQFUCE",
    authDomain: "authentication-app-e2f1a.firebaseapp.com",
    databaseURL: "https://authentication-app-e2f1a-default-rtdb.firebaseio.com",
    projectId: "authentication-app-e2f1a",
    storageBucket: "authentication-app-e2f1a.appspot.com",
    messagingSenderId: "968225166144",
    appId: "1:968225166144:web:c84ea253f85deada8ea0a5",
    measurementId: "G-TQWMQ2DE5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Select elements
const profileDetails = document.querySelector(".profileDetails");
const usernameSpan = document.getElementById("usernameDisplay");
const userEmailSpan = document.getElementById("emailDisplay");
const logoutButton = document.getElementById("logout");
const loginRegisterContainer = document.querySelector(".loginRegister");

// Function to get user details from Firebase
const fetchUserData = async (uid) => {
    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const userData = snapshot.val();
            usernameSpan.textContent = userData.username || "Unknown User";
            userEmailSpan.textContent = userData.email || "No Email Found";
        } else {
            console.error("User data not found!");
        }
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    }
};

// Check if user is logged in via JWT token
document.addEventListener("DOMContentLoaded", async () => {
  const authToken = localStorage.getItem("authToken");

  const profileOptionsContainer = document.getElementById("profileOptionsContainer");
  const profileDetails = document.querySelector(".profileDetails");
  const logoutButton = document.getElementById("logout");

  if (authToken) {
      auth.onAuthStateChanged((user) => {
          if (user) {
              fetchUserData(user.uid);
              
              // Hide login/register options
              profileOptionsContainer.style.display = "none";

              // Show profile details & logout button
              profileDetails.style.display = "block";
              logoutButton.style.display = "flex";
          } else {
              console.error("User not authenticated!");
              localStorage.removeItem("authToken");
              window.location.href = "/login"; // Redirect to login
          }
      });
  } else {
      // Show login/register options
      profileOptionsContainer.style.display = "block";

      // Hide profile details & logout button
      profileDetails.style.display = "none";
      logoutButton.style.display = "none";
  }
});


// Logout functionality
logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
        localStorage.removeItem("authToken"); // Remove JWT token
        window.location.href = "/frontend/components/Login.html"; // Redirect to login page
    } catch (error) {
        console.error("Logout failed:", error.message);
    }
});
