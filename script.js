let currentQuestion = 0;
let score = 0;
let correctAnswer = 0;
const totalQuestions = 10;
let isAnswered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const optionsContainer = document.getElementById('options');
const questionText = document.getElementById('question');
const scoreDisplay = document.getElementById('score');
const questionCountDisplay = document.getElementById('question-count');
const finalScoreDisplay = document.getElementById('final-score');
const feedbackMessage = document.getElementById('feedback-message');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    score = 0;
    currentQuestion = 0;
    isAnswered = false;
    updateScore();
    showScreen('game-screen');
    nextQuestion();
}

function showScreen(screenId) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');

    const target = document.getElementById(screenId);
    target.classList.remove('hidden');
    target.classList.add('active');
}

function nextQuestion() {
    isAnswered = false;
    currentQuestion++;
    
    if (currentQuestion > totalQuestions) {
        endGame();
        return;
    }

    questionCountDisplay.textContent = currentQuestion;

    // Generate random question (2~9 dan)
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 9) + 1;
    correctAnswer = num1 * num2;

    questionText.textContent = `${num1} × ${num2} = ?`;
    
    // Add flip animation to question
    questionText.style.animation = 'none';
    questionText.offsetHeight; // trigger reflow
    questionText.style.animation = 'fadeIn 0.5s';

    generateOptions(correctAnswer, num1, num2);
    
    // Reset any shake animation on container
    document.querySelector('.question-container').classList.remove('shake');
}

function generateOptions(correct, n1, n2) {
    optionsContainer.innerHTML = '';
    
    let answers = [correct];
    
    // Generate 3 wrong answers
    while (answers.length < 4) {
        const type = Math.floor(Math.random() * 3);
        let wrong;
        if (type === 0) {
            wrong = correct + Math.floor(Math.random() * 5) + 1;
        } else if (type === 1) {
            wrong = Math.abs(correct - (Math.floor(Math.random() * 5) + 1));
            if (wrong === 0) wrong = correct + 10;
        } else {
            // common mistake multiply by adjacent number
            wrong = n1 * (n2 + 1);
            if (wrong === correct) wrong = n1 * (n2 + 2);
        }
        
        if (!answers.includes(wrong) && wrong > 0) {
            answers.push(wrong);
        }
    }

    // Shuffle array
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = ans;
        
        // Use closure to capture the btn reference
        btn.onclick = function() { handleAnswer(ans, this); };
        optionsContainer.appendChild(btn);
    });
}

function handleAnswer(selected, btn) {
    if (isAnswered) return;
    isAnswered = true;

    if (selected === correctAnswer) {
        // Correct
        score += 10;
        updateScore();
        btn.classList.add('correct');
        fireConfetti();
        
        setTimeout(() => {
            nextQuestion();
        }, 1200);
    } else {
        // Wrong
        btn.classList.add('wrong');
        document.querySelector('.question-container').classList.add('shake');
        
        // Highlight correct answer
        Array.from(optionsContainer.children).forEach(b => {
            if (parseInt(b.textContent) === correctAnswer) {
                b.style.transform = 'scale(1.1)';
                b.style.boxShadow = '0 0 20px #ffea00';
            }
        });
        
        setTimeout(() => {
            nextQuestion();
        }, 1200);
    }
}

function updateScore() {
    scoreDisplay.textContent = score;
    scoreDisplay.style.animation = 'none';
    scoreDisplay.offsetHeight;
    scoreDisplay.style.animation = 'pulse 0.5s';
}

function fireConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff9ff3', '#feca57', '#48dbfb', '#1dd1a1', '#ffea00']
        });
    }
}

function endGame() {
    showScreen('result-screen');
    finalScoreDisplay.textContent = score;
    
    if (score === 100) {
        feedbackMessage.textContent = "완벽해요! 당신은 진정한 구구단 마스터! 👑👑👑";
        fireConfetti();
        setTimeout(fireConfetti, 500);
        setTimeout(fireConfetti, 1000);
    } else if (score >= 80) {
        feedbackMessage.textContent = "대단해요! 거의 다 맞췄네요! 🌟🌟";
        fireConfetti();
    } else if (score >= 50) {
        feedbackMessage.textContent = "참 잘했어요! 조금만 더 연습해볼까요? 💪";
    } else {
        feedbackMessage.textContent = "포기하지 마세요! 다시 한번 도전! 🌈";
    }
}
