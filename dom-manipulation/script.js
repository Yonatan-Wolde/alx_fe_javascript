// script.js
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

function showRandomQuote() {
  quoteDisplay.innerHTML = "";

  if (quotes.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No quotes available. Add one!";
    quoteDisplay.appendChild(msg);
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteElement = document.createElement("p");
  quoteElement.innerHTML = `"${quote.text}" <span style='font-weight:bold;'>[${quote.category}]</span>`;

  quoteDisplay.appendChild(quoteElement);
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuote";
  addButton.textContent = "Add Quote";

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  addQuoteFormContainer.appendChild(formContainer);

  addButton.addEventListener("click", addQuote);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

newQuoteBtn.addEventListener("click", showRandomQuote);

createAddQuoteForm();
showRandomQuote();