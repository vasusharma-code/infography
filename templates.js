document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const templatesGrid = document.getElementById('templates-grid');
    const ratioFilter = document.getElementById('ratio-filter');

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

    // Template data
    const templates = {
        horizontal: [
            { id: 1, name: 'Business Report', image: 'templates/h1.jpg' },
            { id: 2, name: 'Market Analysis', image: 'templates/h2.jpg' },
            { id: 3, name: 'Timeline', image: 'templates/h3.jpg' },
            { id: 4, name: 'Comparison Chart', image: 'templates/h4.jpg' },
            { id: 5, name: 'Process Flow', image: 'templates/h5.jpg' },
            { id: 6, name: 'Statistics Dashboard', image: 'templates/h6.jpg' },
            { id: 7, name: 'Feature Overview', image: 'templates/h7.jpg' },
            { id: 8, name: 'Data Visualization', image: 'templates/h8.jpg' },
            { id: 9, name: 'Industry Trends', image: 'templates/h9.jpg' },
            { id: 10, name: 'Product Showcase', image: 'templates/h10.jpg' }
        ],
        vertical: [
            { id: 11, name: 'Social Media Story', image: 'templates/v1.jpg' },
            { id: 12, name: 'Mobile Timeline', image: 'templates/v2.jpg' },
            { id: 13, name: 'Step by Step Guide', image: 'templates/v3.jpg' },
            { id: 14, name: 'Product Features', image: 'templates/v4.jpg' },
            { id: 15, name: 'Quick Facts', image: 'templates/v5.jpg' },
            { id: 16, name: 'Bio Template', image: 'templates/v6.jpg' },
            { id: 17, name: 'Case Study', image: 'templates/v7.jpg' },
            { id: 18, name: 'Recipe Card', image: 'templates/v8.jpg' },
            { id: 19, name: 'Daily Schedule', image: 'templates/v9.jpg' },
            { id: 20, name: 'Achievement List', image: 'templates/v10.jpg' }
        ]
    };

    // Function to render templates
    function renderTemplates(orientation) {
        const selectedTemplates = templates[orientation];
        templatesGrid.innerHTML = selectedTemplates.map(template => `
            <div class="template-card">
                <div class="template-preview ${orientation}">
                    <img src="${template.image}" alt="${template.name}">
                </div>
                <div class="template-details">
                    <h3>${template.name}</h3>
                    <a href="#" class="use-template-btn">Use Template</a>
                </div>
            </div>
        `).join('');
    }

    // Filter change handler
    if (ratioFilter) {
        ratioFilter.addEventListener('change', (e) => {
            renderTemplates(e.target.value);
        });
    }

    // Initial render
    renderTemplates('horizontal');
});