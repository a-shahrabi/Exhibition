// ----- Config Values -----

// SUPABASE INIT
const supabaseUrl = 'https://fwbihfghcaojndsfpluz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3YmloZmdoY2Fvam5kc2ZwbHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MzM3ODgsImV4cCI6MjA2OTQwOTc4OH0.1HgGojQhMvm-8GwQy0Z6r1j10Jjjip1Pj53GGiK_IgE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// config
const PADLET_ID = (window.CONFIG && CONFIG.PADLET_ID) || '';
const PADLET_URL = (window.CONFIG && CONFIG.PADLET_URL) || '';
const TEACHABLE_MACHINE_URL = (window.CONFIG && CONFIG.TEACHABLE_MACHINE_URL) || 'https://teachablemachine.withgoogle.com';

// Padlet URL updates
window.addEventListener('DOMContentLoaded', () => {
    const padletIframe = document.getElementById('padlet-iframe');
    const padletLink = document.getElementById('padlet-link');
    const teachableLink = document.getElementById('teachable-link');
    if (padletIframe && PADLET_ID) padletIframe.src = `https://padlet.com/embed/${PADLET_ID}`;
    if (padletLink && PADLET_URL) padletLink.href = PADLET_URL;
    if (teachableLink && TEACHABLE_MACHINE_URL) teachableLink.href = TEACHABLE_MACHINE_URL;
});

// ----- PADLET-STYLE BOARD USING SUPABASE -----

// Submit a new post
async function submitPost() {
    const content = document.getElementById('post-content').value;
    const author = document.getElementById('post-author').value;
    if (!content) {
        showToast("Write something!", "error");
        return;
    }
    await supabase.from('posts').insert([{ content, author }]);
    document.getElementById('post-content').value = '';
    document.getElementById('post-author').value = '';
    loadPosts();
}

// Load all posts
async function loadPosts() {
    let { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
    const postsContainer = document.getElementById('posts-list');
    if (!postsContainer) return;
    postsContainer.innerHTML = '';
    if (posts && posts.length > 0) {
        posts.forEach(post => {
            const el = document.createElement('div');
            el.className = 'post-card';
            el.innerHTML = `<b>${post.author || 'Anonymous'}:</b> ${post.content}<br><small>${new Date(post.created_at).toLocaleString()}</small>`;
            postsContainer.appendChild(el);
        });
    } else {
        postsContainer.innerHTML = '<p style="color: #999;">No posts yet.</p>';
    }
}

// Real-time updates for posts
if (supabase && supabase.channel) {
    supabase
        .channel('public:posts')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => {
            loadPosts();
        })
        .subscribe();
}

// Initial load when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Restore tab state (existing code)
    let savedSection = sessionStorage.getItem('currentSection');
    let completedSections = JSON.parse(sessionStorage.getItem('completedSections') || '[]');
    NavigationModule.completedSections = completedSections;
    if (savedSection && document.getElementById(savedSection)) {
        showTab(savedSection);
    }
    // Padlet posts load
    loadPosts();
});

// ----- Navigation State Management -----
function showTab(section) {
    // Hide all
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    // Show current
    document.getElementById(section).classList.add('active');
    const tabs = document.querySelectorAll('.tab');
    tabs[NavigationModule.sections.indexOf(section)].classList.add('active');

    // Progress UI
    document.querySelectorAll('.progress-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.classList.remove('completed');
    });
    NavigationModule.sections.forEach((s, idx) => {
        const dot = document.querySelector(`.progress-dot[data-section="${s}"]`);
        if (!dot) return;
        if (s === section) dot.classList.add('active');
        if (NavigationModule.completedSections.includes(s)) dot.classList.add('completed');
    });

    // Save state
    sessionStorage.setItem('currentSection', section);
    sessionStorage.setItem('completedSections', JSON.stringify(NavigationModule.completedSections));
    Analytics.trackSectionStart(section);
}
function getCompletedSections() {
    return NavigationModule.completedSections;
}

// ----- Navigation Module -----
const NavigationModule = {
    sections: ['intro', 'examples', 'train', 'share', 'discuss'],
    completedSections: [],
    attachEventListeners() {
        // Add listeners for tab progress tracking
        this.sections.forEach(section => {
            const btn = document.querySelector(`.tab[onclick="showTab('${section}')"]`);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (!this.completedSections.includes(section)) {
                        this.completedSections.push(section);
                        sessionStorage.setItem('completedSections', JSON.stringify(this.completedSections));
                    }
                    Analytics.trackSectionStart(section);
                });
            }
        });
    }
};
NavigationModule.attachEventListeners();

// ----- Analytics -----
const Analytics = {
    startTime: {},
    trackSectionStart(section) {
        this.startTime[section] = Date.now();
    },
    trackSectionComplete(section) {
        const duration = Date.now() - (this.startTime[section] || Date.now());
        // Example: send to analytics, here just console log
        console.log(`Section ${section} completed in ${duration / 1000}s`);
        if (window.CONFIG && CONFIG.ANALYTICS_ENABLED) {
            localStorage.setItem(`time_${section}`, duration);
        }
    }
};

// ----- Toast Notifications -----
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ----- Loading State -----
function showLoadingState(message) {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-content">
            <div class="loading"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
}
function hideLoadingState() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) loader.remove();
}

// ----- Form Validation -----
function validateAndSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const inputs = form.querySelectorAll('input[type="text"], textarea');
    let isValid = true;
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = 'transparent';
        }
    });
    if (isValid) {
        showToast('Great examples! AI really is everywhere!', 'success');
        form.reset();
    } else {
        showToast('Please fill in all fields', 'error');
    }
}

// ----- Game Logic Modularized -----
const gameQuestions = [
    // Fill with real data, add .difficulty property for each: 'easy', 'medium', 'hard'
    { text: "This painting was made by an AI. True or False?", answer: "ai", explanation: "AI can create realistic art!", difficulty: "easy" },
    { text: "This poem is by a human. True or False?", answer: "human", explanation: "It's tough, but humans write with unique emotion!", difficulty: "medium" },
    // Add more questions...
];
const GameModule = {
    questions: gameQuestions,
    currentQuestion: 0,
    score: 0,
    timer: null,
    difficulty: 'easy',
    init() {
        this.shuffle();
        this.render();
    },
    shuffle() {
        this.questions.sort(() => Math.random() - 0.5);
    },
    render() {
        // Rendering logic for current question
    },
    startTimer() {
        let timeLeft = 30;
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            timeLeft--;
            const timerElem = document.getElementById('timer');
            if (timerElem) timerElem.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                checkAnswer(null); // Time's up
            }
        }, 1000);
    }
};

// ----- Error Handling in Game -----
function checkAnswer(userAnswer) {
    try {
        const question = gameQuestions[GameModule.currentQuestion];
        if (!question) throw new Error('Question not found');
        // Game logic: compare userAnswer, update UI
        // Example:
        if (userAnswer === question.answer) {
            showToast('Correct!', 'success');
            GameModule.score++;
        } else {
            showToast('Oops! Try again.', 'error');
        }
        // Advance game, update UI, etc.
    } catch (error) {
        console.error('Game error:', error);
        showToast('Something went wrong. Please try again.', 'error');
    }
}

// ----- Show Completion -----
function showCompletion() {
    document.getElementById('completion').style.display = 'block';
    showToast("Module completed! 🎉", 'success');
}

// For accessibility: Keyboard tab navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
    }
});
