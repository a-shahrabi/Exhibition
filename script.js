// Update progress dots when changing tabs
function updateProgressDots(section) {
    // Get all dots
    const dots = document.querySelectorAll('.progress-dot');
    const sections = ['intro', 'examples', 'train', 'share', 'discuss'];
    const currentIndex = sections.indexOf(section);
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        
        if (index < currentIndex) {
            dot.classList.add('completed');
        } else if (index === currentIndex) {
            dot.classList.add('active');
        }
    });
}

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
        if (tab.textContent.includes(tabTexts[section])) {
            tab.classList.add('active');
        }
    });
    
    // Update progress dots
    updateProgressDots(section);
}