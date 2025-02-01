document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded');

    // Select elements with proper null checks
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const generateBtn = document.getElementById('generate-btn');
    const editBtn = document.getElementById('edit-btn');
    const downloadBtn = document.getElementById('download-btn');
    const preview = document.getElementById('preview');
    const userInput = document.getElementById('user-input');
    const sourceSelect = document.getElementById('source');
    const ratioSelect = document.getElementById('ratio');
    const languageSelect = document.getElementById('language');

    let remainingCredits = 5;
    let generatedContent = null;

    // Function to toggle mobile menu
    function toggleMobileMenu() {
        if (mobileMenuOverlay && sidebar) {
            const isOpen = mobileMenuOverlay.classList.contains('active');
            mobileMenuOverlay.classList.toggle('active');
            sidebar.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'auto' : 'hidden';
        }
    }

    // Attach event listeners with null checks
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                toggleMobileMenu();
            }
        });
    }

    const menuItems = document.querySelectorAll('.mobile-nav a');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    // Utility functions
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function validateInput(content) {
        if (!content) {
            showNotification("Please enter valid text or URL.", 'error');
            return false;
        }
        return true;
    }

    function updateCreditDisplay() {
        const creditsElements = document.querySelectorAll('.credits p');
        creditsElements.forEach(element => {
            element.textContent = `${remainingCredits} Credits Left`;
        });
    }

    // Generate infographic
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            console.log('Generate button clicked');
            if (remainingCredits > 0) {
                const content = userInput?.value.trim();
                const source = sourceSelect?.value;
                const ratio = ratioSelect?.value;
                const language = languageSelect?.value;

                if (validateInput(content)) {
                    generatedContent = { source, content, ratio, language };
                    if (preview) {
                        preview.innerHTML = `
                            <div class="generated-preview">
                                <h2>Infographic Preview</h2>
                                <p>Source: ${source}</p>
                                <p>Content: ${content}</p>
                                <p>Ratio: ${ratio}</p>
                                <p>Language: ${language}</p>
                            </div>
                        `;
                    }
                    if (editBtn) editBtn.disabled = false;
                    if (downloadBtn) downloadBtn.disabled = false;

                    remainingCredits--;
                    updateCreditDisplay();
                    showNotification(`Infographic generated! ${remainingCredits} credits remaining.`);
                }
            } else {
                showNotification("You've used all free trials for today!", 'warning');
            }
        });
    }

    // Edit infographic
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (generatedContent) {
                showNotification("Edit functionality in development", 'info');
            } else {
                showNotification("No infographic to edit", 'error');
            }
        });
    }

    // Download infographic
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (generatedContent) {
                showNotification("Download started...", 'success');
            } else {
                showNotification("No infographic to download", 'error');
            }
        });
    }

    // Update input placeholder based on source type
    if (sourceSelect) {
        sourceSelect.addEventListener('change', (e) => {
            if (userInput) {
                userInput.placeholder = e.target.value === 'url'
                    ? 'Enter website URL...'
                    : 'Enter your text here...';
            }
        });
    }

    // Initial credit display update
    updateCreditDisplay();
});
