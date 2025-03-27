import { googleSignIn, facebookSignIn, emailSignIn } from "../../backend/controllers/authController.js";

const statusBox = document.querySelector(".login-status");
const loginForm = document.querySelector("#login-form");
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

// Email/Password Sign-In
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await emailSignIn(email, password);
    statusBox.classList.toggle("login-success", response.success);
    statusBox.classList.toggle("login-failed", !response.success);
    statusBox.innerHTML = `<p>${response.message}</p>`;
});
