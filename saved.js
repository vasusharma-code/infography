document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality (reuse from main script)
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const savedGrid = document.getElementById('saved-infographics');

    // Toggle mobile menu function
    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            const isOpen = mobileMenuOverlay.style.display === 'block';
            mobileMenuOverlay.style.display = isOpen ? 'none' : 'block';
            document.body.style.overflow = isOpen ? 'auto' : 'hidden';
        }
    }

    // Attach mobile menu event listeners
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Mock saved infographics data (replace with actual data later)
    const savedInfographics = [
        // Example data structure
        // {
        //     id: 1,
        //     title: 'My First Infographic',
        //     date: '2024-02-20',
        //     preview: 'path/to/preview.jpg'
        // }
    ];

    // Function to render saved infographics
    function renderSavedInfographics() {
        if (savedInfographics.length === 0) {
            savedGrid.innerHTML = `
                <div class="no-saved-message">
                    <img src="empty-state.svg" alt="No saved infographics" class="empty-state-img">
                    <h2>No Saved Infographics</h2>
                    <p>Generate your first infographic to see it here!</p>
                    <a href="index.html" class="create-new-btn">Create New Infographic</a>
                </div>
            `;
            return;
        }

        savedGrid.innerHTML = savedInfographics.map(info => `
            <div class="infographic-card">
                <div class="infographic-preview">
                    <img src="${info.preview}" alt="${info.title}">
                </div>
                <div class="infographic-details">
                    <h3>${info.title}</h3>
                    <div class="infographic-meta">
                        <span>Created: ${new Date(info.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Initial render
    renderSavedInfographics();
});