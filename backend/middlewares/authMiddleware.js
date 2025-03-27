const checkAuth = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
      window.location.href = "/login.html";
  } else {
      console.log("User is authenticated.");
  }
};

document.addEventListener("DOMContentLoaded", checkAuth);
