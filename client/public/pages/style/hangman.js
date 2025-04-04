let incorrectGuesses = 0;
let currentUser = localStorage.getItem("currentUser") || null;
let selectedWord = "";
let guessedLetters = new Set();
let difficulty = "normal";
// Updates the Hangman figure
const maxMistakes = {
  easy: 8,
  normal: 6,
  hard: 4,
};
const updateHangman = () => {
  const parts = [
    "head",
    "body",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];

  incorrectGuesses++;
  if (incorrectGuesses <= maxMistakes[difficulty]) {
    const part = document.getElementById(parts[incorrectGuesses - 1]);
    if (part) part.style.display = "block";
  }

  if (incorrectGuesses >= maxMistakes[difficulty]) {
    setTimeout(() => {
      alert("Game Over!");

      if (currentUser) {
        updateScore(currentUser, "loss");
      }
      resetGame();
    }, 100);
  }
};

// Handle user letter guesses
function handleGuess(letter, button) {
  if (selectedWord.includes(letter)) {
    guessedLetters.add(letter);
    updateDisplay();

    setTimeout(() => {
      if (isWin()) {
        alert("Congratulations!");
        updateScore(currentUser, "win");
        resetGame();
      }
      // delay so you can see all the letters displayed
    }, 100);
  } else {
    updateHangman();
  }
  button.disabled = true;
  button.classList.add("used");
}

// Check if the user has guessed all letters correctly
function isWin() {
  return [...selectedWord].every((letter) => guessedLetters.has(letter));
}

// Update the displayed word with guessed letters
function updateDisplay() {
  let displayWord = [...selectedWord]
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");
  document.getElementById("word-display").innerText = displayWord;
}

// Reset the game
async function resetGame() {
  incorrectGuesses = 0;
  guessedLetters.clear();

  // Hide all Hangman body parts
  document.querySelectorAll(".hangman-part").forEach((part) => {
    part.style.display = "none";
  });
  // Clear previous letter buttons
  createLetterButtons();
  await fetchNewWord();
}

// Fetch a new word (mock data for now)
async function fetchNewWord() {
  try {
    let mockData = [
      {
        riddle: "I speak without a mouth and hear without ears. What am I?",
        answer: "echo",
      },
    ];

    selectedWord = mockData[0].answer.toLowerCase();
    document.getElementById("riddle-display").innerText = mockData[0].riddle;
    updateDisplay();
  } catch (error) {
    console.error("Error fetching word:", error);
  }
}

// Function to create letter buttons
function createLetterButtons() {
  const lettersContainer = document.getElementById("letters-container");
  lettersContainer.innerHTML = ""; // Clear previous buttons

  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  alphabet.forEach((letter) => {
    let button = document.createElement("button");
    button.innerText = letter;
    button.classList.add("letter-button");
    button.disabled = false;
    button.classList.remove("used");

    button.onclick = () => {
      handleGuess(letter, button);
    };

    lettersContainer.appendChild(button);
  });
}
// Function to update wins, losses, and streaks
function updateScore(username, result) {
  if (!username) return;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username]) {
    users[username] = { wins: 0, losses: 0, streak: 0 };
  }

  if (result === "win") {
    users[username].wins++;
    users[username].streak++;
  } else if (result === "loss") {
    users[username].losses++;
    users[username].streak = 0;
  }

  localStorage.setItem("users", JSON.stringify(users));

  displayScore(username);
}
// Function to display user score next to the gallows
function displayScore(username) {
  if (!username) return;

  let users = JSON.parse(localStorage.getItem("users")) || {};
  let userData = users[username] || { wins: 0, losses: 0, streak: 0 };

  document.getElementById("wins-count").innerText = userData.wins;
  document.getElementById("streak-count").innerText = userData.streak;
}
document.querySelectorAll(".difficulty-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".difficulty-btn")
      .forEach((b) => b.classList.remove("active"));
    difficulty = btn.dataset.diff;
    btn.classList.add("active");
    resetGame();
  });
});

// Function to get the user's score
function getScore(username) {
  let users = JSON.parse(localStorage.getItem("users")) || {};
  return users[username] || { wins: 0, losses: 0, streak: 0 };
}

// Initialize game on page load
window.onload = () => {
  fetchNewWord();
  createLetterButtons();
  if (currentUser) {
    displayScore(currentUser);
  }
};
