import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { saveFeedback } from "../../backend/controllers/authController.js";

const auth = getAuth();

// Select form elements
const submitForm = document.getElementById("submitForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const feedbackInput = document.getElementById("feedback");
const statusDiv = document.querySelector(".login-status");

// Form Submission Event Listener
submitForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const feedback = feedbackInput.value.trim();
    const user = auth.currentUser; // Get the logged-in user

    if (!username || !email || !feedback) {
        statusDiv.textContent = "Please fill out all fields before submitting.";
        statusDiv.classList.add("login-failed");
        statusDiv.classList.remove("login-success");
        return;
    }

    if (!user) {
        statusDiv.textContent = "You must be logged in to submit feedback.";
        statusDiv.classList.add("login-failed");
        statusDiv.classList.remove("login-success");
        return;
    }

    try {
     
     emailjs.init("LtpyTi_fu2lRK6aco"); 
        // Save feedback to the database
        const response = await saveFeedback(user, username, email, feedback);

        if (response.success) {
            // Send an email using Email.js
            emailjs.send("service_mhr9t9y", "template_bgmaw6h", {
                name: username,
                email: email,
                feedback: feedback
            }).then(() => {
                statusDiv.textContent = "Thank you! Your feedback has been submitted and an email has been sent.";
                statusDiv.classList.add("login-success");
                statusDiv.classList.remove("login-failed");
                submitForm.reset();
            }).catch((error) => {
                console.error("Email sending failed:", error);
                statusDiv.textContent = "Feedback saved, but email could not be sent.";
                statusDiv.classList.add("login-failed");
                statusDiv.classList.remove("login-success");
            });

        } else {
            statusDiv.textContent = "Oops! Something went wrong. Please try again.";
            statusDiv.classList.add("login-failed");
            statusDiv.classList.remove("login-success");
        }

    } catch (error) {
        console.error("Error:", error);
        statusDiv.textContent = "An error occurred. Please try again.";
        statusDiv.classList.add("login-failed");
        statusDiv.classList.remove("login-success");
    }
});
