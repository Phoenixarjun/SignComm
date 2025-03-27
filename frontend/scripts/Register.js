import { googleSignIn, facebookSignIn, emailSignUp } from "../../backend/controllers/authController.js";

const statusBox = document.querySelector(".login-status");
const registerForm = document.querySelector("#Registerform");
const signInWithGoogle = document.querySelector("#signInWithGoogle");
const signInWithFacebook = document.querySelector("#signInWithFacebook");

// Google Sign-In
signInWithGoogle.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await googleSignIn();
    statusBox.classList.toggle("login-success", response.success);
    statusBox.classList.toggle("login-failed", !response.success);
    statusBox.innerHTML = `<p>${response.message}</p>`;
});

// Facebook Sign-In
signInWithFacebook.addEventListener("click", async (e) => {
    e.preventDefault();
    const response = await facebookSignIn();
    statusBox.classList.toggle("login-success", response.success);
    statusBox.classList.toggle("login-failed", !response.success);
    statusBox.innerHTML = `<p>${response.message}</p>`;
});

// Email/Password Registration
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("mail").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const response = await emailSignUp(username, email, password, confirmPassword);
    statusBox.classList.toggle("login-success", response.success);
    statusBox.classList.toggle("login-failed", !response.success);
    statusBox.innerHTML = `<p>${response.message}</p>`;
});
