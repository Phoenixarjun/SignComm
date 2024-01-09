// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Check if the user is logged in
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, get user details from Firebase
        const userId = user.uid;

        // Reference to the user data in the database
        const userRef = database.ref('users/' + userId);

        // Listen for changes in user data
        userRef.on('value', snapshot => {
            const userData = snapshot.val();
            if (userData) {
                updateProfile(userData.username, userData.email, userData.profileImage);
            }
        });
    } else {
        // User is not signed in, redirect to login page or handle accordingly
        window.location.href = 'login.html';
    }
});

// Update profile details on the page
function updateProfile(username, email, profileImage) {
    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const profileImageElement = document.getElementById('profile-image');

    usernameElement.textContent = username;
    emailElement.textContent = email;

    // Set profile image
    if (profileImage) {
        profileImageElement.src = profileImage;
    }
}
