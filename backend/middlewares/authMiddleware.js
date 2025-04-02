const checkAuth = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
      window.location.href = "/login";
  } else {
      console.log("User is authenticated.");
  }
};

document.addEventListener("DOMContentLoaded", checkAuth);
