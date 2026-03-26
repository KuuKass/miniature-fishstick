const API_URL = "https//:tinkr.tech/sdb/moon_cat_space/quizplace";

const questionForm = document.getElementById("questionForm");
const questionsList = document.getElementById("questionsList");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizContainer = document.getElementById("quizContainer");

let allQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allQuestions = data;
    renderQuestions();
  } catch (error) {
    console.error("Viga küsimuste laadimisel:", error);
    questionsList.innerHTML = "<p>Küsimuste laadimine ebaõnnestus.</p>";
  }
}

function renderQuestions() {
  questionsList.innerHTML = "";

  if (allQuestions.length === 0) {
    questionsList.innerHTML = "<p>Küsimusi veel ei ole.</p>";
    return;
  }

  allQuestions.forEach((item) => {
    const div = document.createElement("div");
    div.className = "question-card";

    div.innerHTML = `
      <h3>${item.question}</h3>
      <p>A: ${item.optionA}</p>
      <p>B: ${item.optionB}</p>
      <p>C: ${item.optionC}</p>
      <p>D: ${item.optionD}</p>
    `;

    questionsList.appendChild(div);
  });
}

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newQuestion = {
    question: document.getElementById("question").value,
    optionA: document.getElementById("optionA").value,
    optionB: document.getElementById("optionB").value,
    optionC: document.getElementById("optionC").value,
    optionD: document.getElementById("optionD").value,
    correctAnswer: document.getElementById("correctAnswer").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newQuestion)
    });

    if (!response.ok) {
      throw new Error("POST request failed");
    }

    questionForm.reset();
    fetchQuestions();
  } catch (error) {
    console.error("Viga küsimuse lisamisel:", error);
    alert("Küsimuse lisamine ebaõnnestus.");
  }
});

startQuizBtn.addEventListener("click", () => {
  if (allQuestions.length === 0) {
    quizContainer.innerHTML = "<p>Quiziks pole küsimusi.</p>";
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
});

function showQuestion() {
  if (currentQuestionIndex >= allQuestions.length) {
    quizContainer.innerHTML = `<h3>Quiz läbi!</h3><p>Skoor: ${score} / ${allQuestions.length}</p>`;
    return;
  }

  const q = allQuestions[currentQuestionIndex];

  quizContainer.innerHTML = `
    <div>
      <h3>${q.question}</h3>
      <button class="answer-btn" onclick="checkAnswer('A')">${q.optionA}</button>
      <button class="answer-btn" onclick="checkAnswer('B')">${q.optionB}</button>
      <button class="answer-btn" onclick="checkAnswer('C')">${q.optionC}</button>
      <button class="answer-btn" onclick="checkAnswer('D')">${q.optionD}</button>
    </div>
  `;
}

function checkAnswer(selected) {
  const q = allQuestions[currentQuestionIndex];

  if (selected === q.correctAnswer) {
    score++;
  }

  currentQuestionIndex++;
  showQuestion();
}

fetchQuestions();
