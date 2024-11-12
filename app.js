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
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);


// Collection reference
const cardsCollection = collection(db, "cards");

// Save a card to Firestore
async function saveCard(date, question) {
  await addDoc(cardsCollection, { date, question });
}

// Fetch all cards from Firestore
async function fetchCards() {
  const querySnapshot = await getDocs(cardsCollection);
  const cards = [];
  querySnapshot.forEach((doc) => {
    cards.push({ id: doc.id, ...doc.data() });
  });
  return cards;
}

// Delete a card from Firestore
async function deleteCardFromFirestore(cardId) {
  await deleteDoc(doc(db, "cards", cardId));
}

// Update a card in Firestore
async function updateCardInFirestore(cardId, updatedData) {
  await updateDoc(doc(db, "cards", cardId), updatedData);
}

// Example: Fetch cards and display them
async function loadAndDisplayCards() {
  const cards = await fetchCards();
  cards.forEach((card) => {
    addCard(card.date, card.question, card.id); // Modify addCard to accept card ID
  });
}

// Modify `addCard` function to include card ID for editing/deleting
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
  updateCardDays();
}

// Modify `deleteCard` to remove from Firestore
function deleteCard(button) {
  const card = button.closest(".card");
  const cardId = card.dataset.id; // Firestore card ID
  if (cardId) {
    deleteCardFromFirestore(cardId).then(() => {
      card.remove();
      updateCardDays();
    });
  }
}

// Load cards on page load
window.onload = () => {
  loadAndDisplayCards();
};