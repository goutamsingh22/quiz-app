// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which programming language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctAnswer: 3
    },
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
            "Hyper Tool Markup Language"
        ],
        correctAnswer: 0
    },
    {
        question: "Which is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 2
    },
    {
        question: "What year was JavaScript created?",
        options: ["1995", "1990", "2000", "1989"],
        correctAnswer: 0
    }
];

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30;
let timerInterval = null;
let userAnswers = [];

// DOM elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionNumberEl = document.getElementById('questionNumber');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const questionTextEl = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');

const finalScoreEl = document.getElementById('finalScore');
const totalQuestionsEl = document.getElementById('totalQuestions');
const percentageEl = document.getElementById('percentage');
const resultMessageEl = document.getElementById('resultMessage');
const reviewContainer = document.getElementById('reviewContainer');

// Start quiz
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    loadQuestion();
}

// Load question
function loadQuestion() {
    // Reset timer
    clearInterval(timerInterval);
    timeLeft = 30;
    timerEl.textContent = timeLeft;
    timerEl.classList.remove('warning');
    
    // Disable next button
    nextBtn.disabled = true;
    
    // Update question info
    questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    scoreEl.textContent = `Score: ${score}`;
    
    // Load question
    const currentQuestion = questions[currentQuestionIndex];
    questionTextEl.textContent = currentQuestion.question;
    
    // Clear options
    optionsContainer.innerHTML = '';
    
    // Add options
    currentQuestion.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option';
        optionBtn.textContent = option;
        optionBtn.dataset.index = index;
        optionBtn.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionBtn);
    });
    
    // Start timer
    startTimer();
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Auto-select - no answer selected, treat as wrong
            handleTimeUp();
        }
    }, 1000);
}

// Handle time up
function handleTimeUp() {
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        option.removeEventListener('click', selectOption);
    });
    
    // Record no answer
    userAnswers.push({
        question: questions[currentQuestionIndex].question,
        userAnswer: -1,
        correctAnswer: questions[currentQuestionIndex].correctAnswer,
        options: questions[currentQuestionIndex].options
    });
    
    nextBtn.disabled = false;
}

// Select option
function selectOption(e) {
    clearInterval(timerInterval);
    
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = questions[currentQuestionIndex].correctAnswer;
    
    // Record answer
    userAnswers.push({
        question: questions[currentQuestionIndex].question,
        userAnswer: selectedIndex,
        correctAnswer: correctIndex,
        options: questions[currentQuestionIndex].options
    });
    
    // Update score
    if (selectedIndex === correctIndex) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
    }
    
    // Disable all options
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.classList.add('disabled');
        option.removeEventListener('click', selectOption);
        
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    nextBtn.disabled = false;
}

// Next button
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show results
function showResults() {
    clearInterval(timerInterval);
    
    quizScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);
    
    finalScoreEl.textContent = score;
    totalQuestionsEl.textContent = total;
    percentageEl.textContent = percentage + '%';
    
    // Result message
    if (percentage >= 80) {
        resultMessageEl.textContent = 'Excellent! Great job!';
    } else if (percentage >= 60) {
        resultMessageEl.textContent = 'Good! Keep practicing!';
    } else if (percentage >= 40) {
        resultMessageEl.textContent = 'Not bad! Try again!';
    } else {
        resultMessageEl.textContent = 'Keep studying! You can do better!';
    }
    
    // Show review
    reviewContainer.innerHTML = '';
    userAnswers.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        if (answer.userAnswer === answer.correctAnswer) {
            reviewItem.classList.add('correct');
        } else {
            reviewItem.classList.add('incorrect');
        }
        
        let reviewHTML = `<div class="review-question">Q${index + 1}: ${answer.question}</div>`;
        
        if (answer.userAnswer === -1) {
            reviewHTML += `<div class="review-answer your-answer">Your answer: Time's up (No answer)</div>`;
        } else {
            reviewHTML += `<div class="review-answer your-answer">Your answer: ${answer.options[answer.userAnswer]}</div>`;
        }
        
        reviewHTML += `<div class="review-answer correct-answer">Correct answer: ${answer.options[answer.correctAnswer]}</div>`;
        
        reviewItem.innerHTML = reviewHTML;
        reviewContainer.appendChild(reviewItem);
    });
}

// Restart quiz
restartBtn.addEventListener('click', () => {
    resultsScreen.classList.remove('active');
    startScreen.classList.add('active');
});
