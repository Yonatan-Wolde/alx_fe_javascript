// Initial array of quotes
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Clear previous content
  quoteDisplay.textContent = "";

  // Create elements
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const categorySpan = document.createElement("span");
  categorySpan.textContent = ` [${quote.category}]`;
  categorySpan.style.fontWeight = "bold";

  // Append to display
  quoteText.appendChild(categorySpan);
  quoteDisplay.appendChild(quoteText);
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    // Add new quote object to the array
    quotes.push({ text, category });

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Attach event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Show an initial random quote on load
showRandomQuote();