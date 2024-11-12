import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyB-BHvrJb3BIBGr6E266EHF-nDY3dClhx8",
    authDomain: "cards-cac27.firebaseapp.com",
    databaseURL: "https://cards-cac27-default-rtdb.firebaseio.com",
    projectId: "cards-cac27",
    storageBucket: "cards-cac27.firebasestorage.app",
    messagingSenderId: "392837639634",
    appId: "1:392837639634:web:28dbd6ca100c895097ac0b",
    measurementId: "G-QSYTMBZ5QG"
  };
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const cardsCollection = collection(db, "cards");

// Save a card to Firestore
async function saveCard(date, question) {
  try {
    const docRef = await addDoc(cardsCollection, { date, question });
    console.log("Card saved with ID:", docRef.id);
    return docRef.id; // Return the ID of the saved card
  } catch (error) {
    console.error("Error saving card:", error);
  }
}

// Fetch all cards from Firestore
async function fetchCards() {
  try {
    const querySnapshot = await getDocs(cardsCollection);
    const cards = [];
    querySnapshot.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() });
    });
    return cards;
  } catch (error) {
    console.error("Error fetching cards:", error);
  }
}

// Delete a card from Firestore
async function deleteCardFromFirestore(cardId) {
  try {
    await deleteDoc(doc(db, "cards", cardId));
    console.log("Card deleted:", cardId);
  } catch (error) {
    console.error("Error deleting card:", error);
  }
}

// Update a card in Firestore
async function updateCardInFirestore(cardId, updatedData) {
  try {
    await updateDoc(doc(db, "cards", cardId), updatedData);
    console.log("Card updated:", cardId);
  } catch (error) {
    console.error("Error updating card:", error);
  }
}

// Load and display cards from Firestore
async function loadAndDisplayCards() {
  const cards = await fetchCards();
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = ""; // Clear existing cards
  cards.forEach((card) => {
    addCard(card.date, card.question, card.id);
  });
  updateCardDays(); // Update day numbers
}

// Add a card to the DOM
function addCard(dateValue, questionValue, cardId = null) {
  const cardContainer = document.getElementById("cardContainer");
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = cardId; // Store Firestore card ID

  card.innerHTML = `
    <div>
      <div class="card-header">Day</div>
      <div class="card-date">Date: ${dateValue}</div>
      <div class="card-question">Question: ${questionValue}</div>
    </div>
    <div class="card-buttons">
      <button onclick="editCard(this)">Edit</button>
      <button onclick="deleteCard(this)">Delete</button>
      <button onclick="moveCardUp(this)">&#94;</button>
      <button onclick="moveCardDown(this)">&#118;</button>
    </div>
  `;
  cardContainer.appendChild(card);
}

// Show the input form
function showInputForm() {
  document.getElementById("inputForm").style.display = "block";
  document.getElementById("addCardButton").style.display = "none";
  document.getElementById("dateInput").value = "";
  document.getElementById("questionInput").value = "";
  document.getElementById("editIndicator").textContent = "";
  document.getElementById("deleteButton").style.display = "none";
  editingCard = null;
}

function showInputForm() {
  console.log("Add New Card button clicked"); // Log when button is clicked
  document.getElementById("inputForm").style.display = "block";
  document.getElementById("addCardButton").style.display = "none";
  document.getElementById("dateInput").value = "";
  document.getElementById("questionInput").value = "";
  document.getElementById("editIndicator").textContent = "";
  document.getElementById("deleteButton").style.display = "none";
  editingCard = null;
}

async function submitNewCard() {
  console.log("Submit New Card button clicked");
  const dateValue = document.getElementById("dateInput").value;
  const questionValue = document.getElementById("questionInput").value;

  if (!dateValue || !questionValue) {
    alert("Please enter both a date and a question.");
    return;
  }

  if (editingCard) {
    console.log("Editing existing card");
    const cardId = editingCard.dataset.id;
    editingCard.querySelector(".card-date").textContent = `Date: ${dateValue}`;
    editingCard.querySelector(".card-question").textContent = `Question: ${questionValue}`;
    await updateCardInFirestore(cardId, { date: dateValue, question: questionValue });
  } else {
    console.log("Creating a new card");
    const cardId = await saveCard(dateValue, questionValue);
    addCard(dateValue, questionValue, cardId);
  }

  // Reset form and hide it
  document.getElementById("inputForm").style.display = "none";
  document.getElementById("addCardButton").style.display = "block";
  updateCardDays();
}


// Delete a card
async function deleteCard(button) {
  const card = button.closest(".card");
  const cardId = card.dataset.id;
  if (cardId) {
    await deleteCardFromFirestore(cardId);
    card.remove();
    updateCardDays(); // Update day numbers
  }
}

// Move a card up
function moveCardUp(button) {
  const card = button.closest(".card");
  const previousCard = card.previousElementSibling;
  if (previousCard) {
    card.parentNode.insertBefore(card, previousCard);
    updateCardDays(); // Update day numbers
  }
}

// Move a card down
function moveCardDown(button) {
  const card = button.closest(".card");
  const nextCard = card.nextElementSibling;
  if (nextCard) {
    card.parentNode.insertBefore(nextCard, card);
    updateCardDays(); // Update day numbers
  }
}

// Update day numbers dynamically
function updateCardDays() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.querySelector(".card-header").textContent = `Day ${index + 1}`;
  });
}

// Load cards on page load
window.onload = () => {
  loadAndDisplayCards();
};