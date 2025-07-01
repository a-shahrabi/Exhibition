// Navigation
function showTab(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Find the correct tab to activate
    const tabTexts = {
        'intro': '1. What is AI?',
        'examples': '2. Surrounded by AI',
        'train': '3. Train Your AI',
        'share': '4. Share & React',
        'discuss': '5. Can AI be Sus?'
    };
    
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.textContent === tabTexts[section]) {
            tab.classList.add('active');
        }
    });
}

// Show completion
function showCompletion() {
    document.getElementById('completion').style.display = 'block';
}

// AI or Human Game
const gameQuestions = [
    {
        content: "Roses are red, violets are blue, sugar is sweet, and so are you!",
        answer: "human",
        explanation: "This is a classic human poem that's been around for centuries! Humans love simple rhymes."
    },
    {
        content: "The ethereal moonlight cascaded through crystalline dewdrops, creating a symphony of luminescent whispers.",
        answer: "ai",
        explanation: "AI often uses fancy words that don't quite make sense together. 'Luminescent whispers'? That's typical AI!"
    },
    {
        content: "OMG this pizza is literally fire 🔥🔥🔥 no cap fr fr",
        answer: "human",
        explanation: "This is how real people (especially young people) text! AI struggles with modern slang and emojis."
    },
    {
        content: "To optimize your productivity, integrate systematic methodologies while leveraging synergistic paradigms.",
        answer: "ai",
        explanation: "AI loves using business buzzwords that sound smart but don't really mean anything!"
    },
    {
        content: "My dog ate my homework. I know it sounds fake but it actually happened!",
        answer: "human",
        explanation: "This is a classic human excuse! The self-aware 'I know it sounds fake' is very human."
    },
    {
        content: "In the quantum realm of possibilities, where dreams intertwine with binary sequences, consciousness emerges.",
        answer: "ai",
        explanation: "AI often mixes random tech/science words to sound deep. Quantum + binary + consciousness = definitely AI!"
    },
    {
        content: "Just burned my toast again. Why am I like this? 😭",
        answer: "human",
        explanation: "Real human frustration! The self-deprecating humor and crying emoji are very human."
    },
    {
        content: "The majestic elephant gracefully danced upon the velvet clouds of imagination.",
        answer: "ai",
        explanation: "AI creates impossible scenarios with flowery language. Elephants don't dance on clouds!"
    }
];

let currentQuestion = 0;
let score = 0;
let totalAnswered = 0;

// Initialize game
function initGame() {
    currentQuestion = 0;
    score = 0;
    totalAnswered = 0;
    showQuestion();
}

// Show current question
function showQuestion() {
    if (currentQuestion >= 5) { // Show only 5 questions per game
        endGame();
        return;
    }
    
    const question = gameQuestions[currentQuestion];
    document.getElementById('question-number').textContent = `Question ${currentQuestion + 1} of 5`;
    document.getElementById('question-content').textContent = question.content;
    document.getElementById('game-question').style.display = 'block';
    document.getElementById('game-result').style.display = 'none';
}

// Check answer
function checkAnswer(userAnswer) {
    const question = gameQuestions[currentQuestion];
    const isCorrect = userAnswer === question.answer;
    
    totalAnswered++;
    if (isCorrect) {
        score++;
    }
    
    // Update score display
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalAnswered;
    
    // Show result
    const resultBox = document.getElementById('game-result');
    resultBox.className = isCorrect ? 'result-box correct' : 'result-box incorrect';
    document.getElementById('result-message').textContent = isCorrect ? '✅ Correct!' : '❌ Not quite!';
    document.getElementById('result-explanation').textContent = question.explanation;
    
    document.getElementById('game-question').style.display = 'none';
    resultBox.style.display = 'block';
}

// Next question
function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

// End game
function endGame() {
    const percentage = Math.round((score / 5) * 100);
    let message = '';
    
    if (percentage === 100) {
        message = "Perfect! You're an AI detection expert! 🏆";
    } else if (percentage >= 80) {
        message = "Great job! You really understand AI! 🌟";
    } else if (percentage >= 60) {
        message = "Good work! You're learning to spot AI! 👍";
    } else {
        message = "Nice try! AI can be tricky to spot! Keep learning! 📚";
    }
    
    document.getElementById('final-score').textContent = `${score} out of 5 (${percentage}%)`;
    document.getElementById('score-message').textContent = message;
    document.getElementById('game-question').style.display = 'none';
    document.getElementById('game-result').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
}

// Restart game
function restartGame() {
    // Shuffle questions for variety
    gameQuestions.sort(() => Math.random() - 0.5);
    
    // Reset game
    currentQuestion = 0;
    score = 0;
    totalAnswered = 0;
    
    // Reset display
    document.getElementById('score').textContent = '0';
    document.getElementById('total').textContent = '0';
    document.getElementById('game-over').style.display = 'none';
    
    // Start again
    showQuestion();
}

// Start game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the examples section
    if (document.getElementById('ai-game-container')) {
        initGame();
    }
});