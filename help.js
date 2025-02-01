document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const sidebar = document.querySelector('.sidebar');

    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.style.display = mobileMenuOverlay.style.display === 'block' ? 'none' : 'block';
            sidebar.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.style.display === 'block' ? 'hidden' : 'auto';
        }
    }

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Documentation navigation
    const docLinks = document.querySelectorAll('.docs-nav a');
    const searchInput = document.getElementById('searchDocs');
    const docSections = document.querySelectorAll('.doc-section');

    // Smooth scroll to section
    docLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Update active state
            docLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            docSections.forEach(section => {
                const text = section.textContent.toLowerCase();
                const matches = text.includes(searchTerm);
                section.style.display = matches ? 'block' : 'none';
            });
        });
    }

    // Intersection Observer for active section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                docLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.5 });

    docSections.forEach(section => observer.observe(section));

    // Handle mobile navigation
    docLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });
});