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