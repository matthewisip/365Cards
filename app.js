let editingCard = null;

// Load saved data from localStorage
function loadSavedCards() {
  const savedData = localStorage.getItem('cards');
  if (savedData) {
    const cards = JSON.parse(savedData);
    cards.forEach((card) => {
      addCard(card.date, card.question);
    });
    updateCardDays(); // Update days based on the loaded order
  }
}

// Save cards to localStorage
function saveCards() {
  const cards = [];
  const cardElements = document.querySelectorAll('.card');
  cardElements.forEach((card) => {
    const date = card.querySelector('.card-date').textContent.replace('Date: ', '');
    const question = card.querySelector('.card-question').textContent.replace('Question: ', '');
    cards.push({ date, question });
  });
  localStorage.setItem('cards', JSON.stringify(cards));
}

function showInputForm() {
  document.getElementById('inputForm').style.display = 'block';
  document.getElementById('addCardButton').style.display = 'none';
  document.getElementById('dateInput').value = '';
  document.getElementById('questionInput').value = '';
  document.getElementById('editIndicator').textContent = ''; // Clear edit indicator
  document.getElementById('deleteButton').style.display = 'none'; // Hide delete button
  editingCard = null; // Reset editing mode
}

function submitNewCard() {
  const dateValue = document.getElementById('dateInput').value;
  const questionValue = document.getElementById('questionInput').value;

  if (!dateValue || !questionValue) {
    alert('Please enter both a date and a question.');
    return;
  }

  if (editingCard) {
    // Update the existing card in edit mode
    editingCard.querySelector('.card-date').textContent = `Date: ${dateValue}`;
    editingCard.querySelector('.card-question').textContent = `Question: ${questionValue}`;
  } else {
    // Create a new card
    addCard(dateValue, questionValue);
  }

  // Save the updated cards and update the question box
  saveCards();
  updateQuestionBox();
  updateCardDays(); // Recalculate day numbers

  // Reset form and hide it
  document.getElementById('inputForm').style.display = 'none';
  document.getElementById('addCardButton').style.display = 'block';
}

function addCard(dateValue, questionValue) {
  const cardContainer = document.getElementById('cardContainer');

  // Create a new card element
  const card = document.createElement('div');
  card.className = 'card';

  // Add content to the card
  card.innerHTML = `
    <div>
      <div class="card-header">Day</div>
      <div class="card-date">Date: ${dateValue}</div>
      <div class="card-question">Question: ${questionValue}</div>
    </div>
    <div class="card-buttons">
      <button onclick="editCard(this)">Edit</button>
      <button onclick="moveCardUp(this)">&#94;</button>
      <button onclick="moveCardDown(this)">&#118;</button>
    </div>
  `;

  // Append the card to the container
  cardContainer.appendChild(card);

  // Update the question box
  updateQuestionBox();
  updateCardDays(); // Recalculate day numbers
}

function editCard(button) {
  // Show the input form for editing
  showInputForm();
  editingCard = button.closest('.card'); // Reference the card being edited

  // Extract the current day, date, and question values
  const existingDay = editingCard.querySelector('.card-header').textContent.match(/\d+/)[0];
  const existingDate = editingCard.querySelector('.card-date').textContent.replace('Date: ', '');
  const existingQuestion = editingCard.querySelector('.card-question').textContent.replace('Question: ', '');

  // Update the edit indicator to show which card is being edited
  document.getElementById('editIndicator').textContent = `Editing Day ${existingDay}`;
  document.getElementById('dateInput').value = existingDate;
  document.getElementById('questionInput').value = existingQuestion;

  // Show the delete button in the edit form
  const deleteButton = document.getElementById('deleteButton');
  deleteButton.style.display = 'block';
}

function moveCardUp(button) {
  const card = button.closest('.card');
  const previousCard = card.previousElementSibling;
  if (previousCard) {
    card.parentNode.insertBefore(card, previousCard);
    saveCards();
    updateQuestionBox();
    updateCardDays(); // Recalculate day numbers
  }
}

function moveCardDown(button) {
  const card = button.closest('.card');
  const nextCard = card.nextElementSibling;
  if (nextCard) {
    card.parentNode.insertBefore(nextCard, card);
    saveCards();
    updateQuestionBox();
    updateCardDays(); // Recalculate day numbers
  }
}

function deleteCard() {
  if (editingCard) {
    editingCard.remove(); // Remove the card element from the DOM
    saveCards(); // Update localStorage
    updateQuestionBox(); // Update the question list
    updateCardDays(); // Recalculate day numbers
  }

  // Reset the form and hide the input form
  document.getElementById('inputForm').style.display = 'none';
  document.getElementById('addCardButton').style.display = 'block';
  document.getElementById('deleteButton').style.display = 'none';
}

function updateCardDays() {
  const cardElements = document.querySelectorAll('.card');
  cardElements.forEach((card, index) => {
    card.querySelector('.card-header').textContent = `Day ${index + 1}`;
  });
}

function updateQuestionBox() {
  const questionList = document.getElementById('questionList');
  questionList.innerHTML = ''; // Clear the existing list

  // Get all cards and extract the questions
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    const question = card.querySelector('.card-question').textContent.replace('Question: ', '');
    const listItem = document.createElement('li');
    listItem.textContent = question;
    questionList.appendChild(listItem);
  });
}

// Attach event listener to the add button
document.getElementById('addCardButton').addEventListener('click', showInputForm);

// Load saved cards on page load
window.onload = () => {
  loadSavedCards();
  updateQuestionBox();
};
