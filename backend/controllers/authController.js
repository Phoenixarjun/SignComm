import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider, 
    FacebookAuthProvider 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Initialize Firebase
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

const app = initializeApp(firebaseConfig);  
const auth = getAuth(app); 
const database = getDatabase(app); 

// Function to store user data in Firebase database
const setDB = async (user, username, email) => {
    try {
        await set(ref(database, `users/${user.uid}`), {
            username: username || user.displayName,
            email: email || user.email,
        });
    } catch (error) {
        console.error("Error storing user data:", error.message);
    }
};

// Function to generate and store JWT token
const storeToken = async (user) => {
    try {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
    } catch (error) {
        console.error("Error storing token:", error.message);
    }
};

// Function for Google Sign-In
export const googleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await setDB(user, user.displayName, user.email);
        await storeToken(user);

        // Redirect to home page
        window.location.href = "/home";  
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        return { success: false, message: error.message };
    }
};

// Function for Facebook Sign-In
export const facebookSignIn = async () => {
    try {
        const provider = new FacebookAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await setDB(user, user.displayName, user.email);
        await storeToken(user);

        // Redirect to home page
        window.location.href = "/home";  
    } catch (error) {
        console.error("Facebook Sign-In Error:", error.message);
        return { success: false, message: error.message };
    }
};

// Function for Email/Password Sign-In
export const emailSignIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await storeToken(user);

        // Redirect to home page
        window.location.href = "/home";  

        return { success: true, message: `Logged in as: ${email.split("@")[0]}` };
    } catch (error) {
        let errorMessage = "An error occurred during login.";

        switch (error.code) {
            case "auth/user-not-found":
                errorMessage = "User not found!";
                break;
            case "auth/wrong-password":
                errorMessage = "Incorrect password!";
                break;
            case "auth/invalid-email":
                errorMessage = "Invalid email!";
                break;
            default:
                errorMessage = error.message;
        }

        console.error("Email Sign-In Error:", errorMessage);
        return { success: false, message: errorMessage };
    }
};

// Function for Email/Password Registration
export const emailSignUp = async (username, email, password, confirmPassword) => {
    if (password !== confirmPassword) {
        return { success: false, message: "Passwords do not match. Please try again." };
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDB(user, username, email);
        await storeToken(user);

        // Redirect to home page
        window.location.href = "/home";  

        return { success: true, message: "Congratulations! You have successfully registered!" };
    } catch (error) {
        let errorMessage = "An error occurred during registration.";

        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage = "Email is already registered!";
                break;
            case "auth/weak-password":
                errorMessage = "Password is too weak!";
                break;
            case "auth/invalid-email":
                errorMessage = "Invalid email format!";
                break;
            default:
                errorMessage = error.message;
        }

        console.error("Email Sign-Up Error:", errorMessage);
        return { success: false, message: errorMessage };
    }
};
