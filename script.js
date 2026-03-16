const sentences = {
  literature: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness. Call me Ishmael. Some years ago never mind how long precisely having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. Happy families are all alike; every unhappy family is unhappy in its own way. It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. Whether I shall turn out to be the hero of my own life depends wholly on these pages.",
  
  science: "The theory of relativity revolutionized our understanding of space, time, and gravity. Einstein showed that space and time are not absolute but relative to the observer's frame of reference. Quantum mechanics describes the behavior of matter and energy at the atomic and subatomic levels. Unlike classical physics, quantum particles can exist in multiple states simultaneously. The human brain contains approximately 86 billion neurons, each forming thousands of connections with other neurons. These neural networks enable all our thoughts, memories, and behaviors. Photosynthesis is the process by which plants convert light energy into chemical energy. This process produces oxygen as a byproduct and is fundamental to life on Earth. DNA is the molecule that carries genetic instructions for all living organisms. Its double helix structure allows it to replicate accurately and pass information to offspring.",
  
  technology: "Artificial intelligence is transforming industries by automating complex tasks and enabling machines to learn from data. Machine learning algorithms improve their performance through experience. Cloud computing allows users to access computing resources and data from anywhere in the world. This scalable technology has revolutionized software deployment and data storage. Blockchain technology provides a secure, decentralized way to record transactions. It uses cryptography to ensure that data cannot be altered once recorded. The Internet of Things connects billions of devices worldwide, enabling them to collect and share data. IoT applications range from smart homes to industrial monitoring systems. Cybersecurity is critical in protecting digital assets from theft and damage. Modern security involves encryption, firewalls, intrusion detection, and continuous monitoring.",
  
  history: "The Renaissance was a cultural movement that spanned the 14th to 17th centuries, beginning in Italy and spreading throughout Europe. It marked the transition from medieval to modern times. The Industrial Revolution began in Britain in the late 18th century and transformed society through mechanization and factory systems. It led to urbanization and the rise of modern capitalism. World War II was the deadliest conflict in human history, lasting from 1939 to 1945. It involved most of the world's nations and resulted in significant geopolitical changes. The ancient Roman Empire lasted over 1000 years and created a vast network of roads, aqueducts, and buildings. Roman law and governance systems influenced modern democracies. The French Revolution of 1789 overthrew the monarchy and established principles of liberty, equality, and fraternity that influenced democratic movements worldwide.",
  
  nature: "The Amazon rainforest is home to approximately 10% of all species on Earth. It produces about 20% of the world's oxygen and plays a crucial role in regulating global climate. Coral reefs are among the most diverse ecosystems on the planet, supporting thousands of species despite covering less than 1% of the ocean floor. Migration is an incredible phenomenon where animals travel vast distances seasonally. Arctic terns migrate roughly 44,000 miles annually, the longest migration of any animal. The water cycle describes how water moves between the ocean, atmosphere, and land. Evaporation, condensation, precipitation, and infiltration are essential processes. Plate tectonics explains how Earth's outer shell is divided into plates that move. This movement causes earthquakes, volcanoes, and the formation of mountain ranges."
};

let currentDuration = 60;
let totalTime = 60;
let timeLeft = 60;
let timerInterval = null;
let typingStarted = false;
let currentSentence = "";
let leaderboard = [];
let testStartTime = 0;

const sentenceElement = document.getElementById("sentence");
const inputElement = document.getElementById("input");
const timeElement = document.getElementById("time");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");
const restartButton = document.getElementById("restart");
const themeButton = document.getElementById("theme");
const topicSelect = document.getElementById("topic");
const durationSelect = document.getElementById("duration");
const progressElement = document.getElementById("progress");
const saveScoreButton = document.getElementById("save-score");
const playerNameInput = document.getElementById("player-name");
const saveScoreSection = document.getElementById("save-score-section");
const leaderboardTable = document.getElementById("leaderboard");
const clearLeaderboardButton = document.getElementById("clear-leaderboard");

// Initialize
loadLeaderboard();
loadTheme();
selectTopic();

// Event Listeners
topicSelect.addEventListener("change", selectTopic);
durationSelect.addEventListener("change", changeDuration);
inputElement.addEventListener("input", handleInput);
restartButton.addEventListener("click", restartTest);
themeButton.addEventListener("click", toggleTheme);
saveScoreButton.addEventListener("click", saveScore);
clearLeaderboardButton.addEventListener("click", clearLeaderboard);
playerNameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveScore();
});

function selectTopic() {
  const topic = topicSelect.value;
  currentSentence = sentences[topic];
  sentenceElement.textContent = currentSentence;
  restartTest();
}

function changeDuration() {
  currentDuration = parseInt(durationSelect.value);
  totalTime = currentDuration;
  timeLeft = currentDuration;
  timeElement.textContent = currentDuration;
  restartTest();
}

function handleInput() {
  if (!typingStarted && inputElement.value.length > 0) {
    typingStarted = true;
    testStartTime = Date.now();
    startTimer();
  }

  if (typingStarted) {
    calculateStats();
    updateTextColor();
  }
}

function updateTextColor() {
  const userInput = inputElement.value;
  const sentenceText = currentSentence;
  
  let coloredText = '';
  
  for (let i = 0; i < sentenceText.length; i++) {
    if (i < userInput.length) {
      if (userInput[i] === sentenceText[i]) {
        coloredText += `<span class="correct">${sentenceText[i]}</span>`;
      } else {
        coloredText += `<span class="incorrect">${sentenceText[i]}</span>`;
      }
    } else {
      coloredText += sentenceText[i];
    }
  }
  
  sentenceElement.innerHTML = coloredText;
}

function calculateStats() {
  const userInput = inputElement.value;
  const sentenceText = currentSentence;
  const elapsedTime = Math.floor((Date.now() - testStartTime) / 1000);

  // Calculate WPM
  const words = userInput.trim().split(/\s+/).length;
  const minutes = (elapsedTime / 60) || 0.016;
  const wpm = Math.round(words / minutes);
  wpmElement.textContent = wpm;

  // Calculate Accuracy (percentage of correct characters)
  let correctChars = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === sentenceText[i]) {
      correctChars++;
    }
  }
  
  const accuracy = userInput.length > 0
    ? Math.round((correctChars / userInput.length) * 100)
    : 0;
  accuracyElement.textContent = accuracy;

  // Update progress bar
  const progress = (userInput.length / sentenceText.length) * 100;
  progressElement.style.width = Math.min(progress, 100) + "%";
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      endTest();
    }
  }, 1000);
}

function endTest() {
  clearInterval(timerInterval);
  inputElement.disabled = true;
  saveScoreSection.style.display = "flex";
  playerNameInput.focus();
}

function restartTest() {
  clearInterval(timerInterval);
  typingStarted = false;
  timeLeft = currentDuration;
  timeElement.textContent = currentDuration;
  inputElement.value = "";
  inputElement.disabled = false;
  wpmElement.textContent = "0";
  accuracyElement.textContent = "0";
  progressElement.style.width = "0%";
  saveScoreSection.style.display = "none";
  playerNameInput.value = "";
  sentenceElement.textContent = currentSentence;
  inputElement.focus();
}

function saveScore() {
  const playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Please enter your name!");
    return;
  }

  const score = {
    name: playerName,
    wpm: parseInt(wpmElement.textContent),
    accuracy: parseInt(accuracyElement.textContent),
    timestamp: new Date().toISOString()
  };

  leaderboard.push(score);
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  leaderboard = leaderboard.slice(0, 10);

  saveLeaderboard();
  displayLeaderboard();
  restartTest();
}

function displayLeaderboard() {
  const tbody = leaderboardTable.querySelector("tbody");
  tbody.innerHTML = "";

  leaderboard.forEach((score, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${score.name}</td>
      <td>${score.wpm}</td>
      <td>${score.accuracy}%</td>
    `;
    tbody.appendChild(row);
  });
}

function saveLeaderboard() {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const saved = localStorage.getItem("leaderboard");
  leaderboard = saved ? JSON.parse(saved) : [];
  displayLeaderboard();
}

function clearLeaderboard() {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    leaderboard = [];
    localStorage.removeItem("leaderboard");
    displayLeaderboard();
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function loadTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  }
}