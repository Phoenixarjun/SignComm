const signDetails = [
  { id: 1, Label: "I Don’t Know", Image: "../../assets/signs/idontknow.gif" },
  { id: 2, Label: "Stop", Image: "../../assets/signs/stop.gif" },
  { id: 3, Label: "Nothing", Image: "../../assets/signs/nothing.gif" },
  { id: 4, Label: "Applause", Image: "../../assets/signs/applause.gif" },
  { id: 5, Label: "Goodbye", Image: "../../assets/signs/goodbye.gif" },
  { id: 6, Label: "Super", Image: "../../assets/signs/super.gif" },
  { id: 7, Label: "Yes", Image: "../../assets/signs/yes.gif" },
  { id: 8, Label: "Understand", Image: "../../assets/signs/understand.gif" },
  { id: 9, Label: "Keep Calm and Stay Home", Image: "../../assets/signs/keepclamandstayhome.gif" },
  { id: 10, Label: "Cool", Image: "../../assets/signs/cool.gif" },
  { id: 11, Label: "Happy", Image: "../../assets/signs/happy.gif" },
  { id: 12, Label: "Sorry", Image: "../../assets/signs/sorry.gif" },
  { id: 13, Label: "How Are You", Image: "../../assets/signs/howareyou.gif" },
  { id: 14, Label: "Thank You", Image: "../../assets/signs/thankyou.gif" },
  { id: 15, Label: "No", Image: "../../assets/signs/no.gif" },
  { id: 16, Label: "Please", Image: "../../assets/signs/please.gif" },
  { id: 17, Label: "Nice to Meet You", Image: "../../assets/signs/nicetomeetyou.gif" },
  { id: 18, Label: "I Love You", Image: "../../assets/signs/iloveyou.gif" }
];


// Get container elements
const signContainer = document.querySelector(".sign-gif-container");
const searchInput = document.getElementById("searchInput");

// Function to render all cards
function renderSigns(signs) {
  signContainer.innerHTML = ""; // Clear existing cards
  signs.forEach(sign => {
    const card = document.createElement("div");
    card.classList.add("sign-card");

    card.innerHTML = `
      <img src="${sign.Image}" alt="${sign.Label}" class="sign-gif">
      <h2>${sign.Label}</h2>
    `;

    signContainer.appendChild(card);
  });
}

// Initial render with all signs
renderSigns(signDetails);

// Add search functionality
searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  const filteredSigns = signDetails.filter(sign =>
    sign.Label.toLowerCase().includes(searchValue)
  );

  renderSigns(filteredSigns);
});
