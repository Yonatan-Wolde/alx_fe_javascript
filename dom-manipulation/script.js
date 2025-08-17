let quotes = [];
let serverQuotes = [];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteFormContainer = document.getElementById("addQuoteFormContainer");
const exportBtn = document.getElementById("exportQuotes");
const importFileInput = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const syncNotification = document.getElementById("syncNotification");
const conflictResolutionDiv = document.getElementById("conflictResolution");
const conflictListDiv = document.getElementById("conflictList");

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to predict the future is to create it.", category: "Motivation" },
      { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

function showRandomQuote() {
  quoteDisplay.innerHTML = "";
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No quotes available for this category.";
    quoteDisplay.appendChild(msg);
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteElement = document.createElement("p");
  quoteElement.innerHTML = `"${quote.text}" <span style='font-weight:bold;'>[${quote.category}]</span>`;
  quoteDisplay.appendChild(quoteElement);
}

function filterQuotes() {
  localStorage.setItem("selectedCategory", categoryFilter.value);
  showRandomQuote();
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
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function exportQuotesToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert('Quotes imported successfully!');
    } catch(err) {
      alert('Invalid JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Server Sync and Conflict Resolution with POST
async function fetchQuotesFromServer() {
  try {
    // Fetch existing quotes
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    serverQuotes = data.slice(0, 5).map(post => ({ text: post.title, category: 'Server' }));

    // Send local quotes to server (simulated POST)
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    });

    resolveConflicts();
  } catch (err) {
    console.error('Error syncing with server:', err);
  }
}

function resolveConflicts() {
  const conflicts = serverQuotes.filter(sq => quotes.some(lq => lq.text === sq.text && lq.category !== sq.category));
  if (conflicts.length > 0) {
    conflictListDiv.innerHTML = '';
    conflicts.forEach(conflict => {
      const div = document.createElement('div');
      div.textContent = `Local: ${quotes.find(q => q.text === conflict.text).category}, Server: ${conflict.category}`;
      const keepServerBtn = document.createElement('button');
      keepServerBtn.textContent = 'Keep Server';
      keepServerBtn.addEventListener('click', () => {
        quotes = quotes.map(q => q.text === conflict.text ? conflict : q);
        saveQuotes();
        populateCategories();
        conflictResolutionDiv.style.display = 'none';
      });
      div.appendChild(keepServerBtn);
      conflictListDiv.appendChild(div);
    });
    conflictResolutionDiv.style.display = 'block';
  } else {
    const serverTextSet = new Set(serverQuotes.map(q => q.text));
    quotes = quotes.filter(q => !serverTextSet.has(q.text));
    quotes.push(...serverQuotes);
    saveQuotes();
    populateCategories();
    syncNotification.textContent = 'Quotes synchronized with server.';
    syncNotification.style.display = 'block';
    setTimeout(() => { syncNotification.style.display = 'none'; }, 3000);
  }
}

setInterval(fetchQuotesFromServer, 60000);

newQuoteBtn.addEventListener("click", showRandomQuote);
exportBtn.addEventListener("click", exportQuotesToJson);
importFileInput.addEventListener("change", importFromJsonFile);
categoryFilter.addEventListener("change", filterQuotes);

loadQuotes();
populateCategories();
createAddQuoteForm();
showRandomQuote();
fetchQuotesFromServer();