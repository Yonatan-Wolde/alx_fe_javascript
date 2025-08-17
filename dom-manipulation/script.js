const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available. Add one!</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `<p>"${quote.text}" <span style='font-weight:bold;'>[${quote.category}]</span></p>`;
}

function createAddQuoteForm() {
  addQuoteFormContainer.innerHTML = `
    <div class="form-container">
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button id="addQuote">Add Quote</button>
    </div>
  `;

  const addQuoteBtn = document.getElementById("addQuote");
  addQuoteBtn.addEventListener("click", addQuote);
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