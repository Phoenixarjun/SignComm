import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { saveContributors } from "../../backend/controllers/authController.js";

// Initialize elements
const auth = getAuth();
const contributeForm = document.getElementById("contributeForm");
const loginStatus = document.querySelector(".login-status");
const formContainer = document.querySelector(".form-box.login");

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (!user) {
        showMessage("Please log in to contribute.", "error");
        formContainer.style.opacity = "0.5";
        formContainer.style.pointerEvents = "none";
    } else {
        clearMessage();
        formContainer.style.opacity = "1";
        formContainer.style.pointerEvents = "auto";
    }
});

// Form submission handler
contributeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        contact: document.getElementById("contact").value.trim(),
        understanding: document.getElementById("understanding").value.trim(),
        proof: document.getElementById("proof").value.trim(),
        experience: document.getElementById("experience").value.trim()
    };

    // Validate form
    if (Object.values(formData).some(field => !field)) {
        showMessage("Please fill all fields!", "error");
        return;
    }

    // Submit data
    try {
        showMessage("Submitting your contribution...", "info");

        const result = await saveContributors(
            formData.name,
            formData.email,
            formData.contact,
            formData.understanding,
            formData.proof,
            formData.experience
        );

        if (result.success) {
            showMessage(result.message || "Thank you for your contribution!", "success");
            contributeForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(clearMessage, 5000);
        } else {
            showMessage(result.message || "Submission failed. Please try again.", "error");
        }
    } catch (error) {
        console.error("Submission error:", error);
        showMessage(error.message || "An unexpected error occurred. Please try again.", "error");
    }
});

// Helper functions for message display
function showMessage(message, type) {
    loginStatus.textContent = message;
    loginStatus.className = "login-status"; // Reset classes
    
    switch(type) {
        case "success":
            loginStatus.classList.add("login-success");
            break;
        case "error":
            loginStatus.classList.add("login-failed");
            break;
        case "info":
            loginStatus.classList.add("login-info");
            break;
        default:
            loginStatus.classList.add("login-info");
    }
}

function clearMessage() {
    loginStatus.textContent = "";
    loginStatus.className = "login-status";
}