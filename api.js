document.addEventListener('DOMContentLoaded', () => {
    // Update element selection
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const sidebar = document.querySelector('.sidebar');

    // Mobile menu toggle function
    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.style.display = mobileMenuOverlay.style.display === 'block' ? 'none' : 'block';
            sidebar.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.style.display === 'block' ? 'hidden' : 'auto';
        }
    }

    // Event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            console.log('Hamburger clicked'); // Debug
            toggleMobileMenu();
        });
    }

    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                toggleMobileMenu();
            }
        });
    }

    // Elements for Other Features
    const copyButtons = document.querySelectorAll('.copy-btn');
    const apiTestForm = document.getElementById('api-test-form');
    const responseDisplay = document.getElementById('response-display');

    // Copy functionality for multiple buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const code = button.dataset.code;
            try {
                await navigator.clipboard.writeText(code);
                const originalText = button.innerHTML;
                button.innerHTML = '<span>✓</span>';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // API Test functionality
    apiTestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const apiKey = document.getElementById('api-key').value;
        const prompt = document.getElementById('prompt').value;
        const language = document.getElementById('language').value;
        const ratio = document.getElementById('ratio').value;

        if (!apiKey || !prompt) {
            showNotification('API key and prompt are required', 'error');
            return;
        }

        try {
            // Show loading state
            const submitBtn = apiTestForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Testing...';
            submitBtn.disabled = true;

            // Mock API call
            const response = await mockApiCall({
                apiKey,
                prompt,
                language,
                ratio
            });

            // Display response
            responseDisplay.classList.add('active');
            const codeElement = responseDisplay.querySelector('code');
            codeElement.textContent = JSON.stringify(response, null, 2);

            showNotification('API test successful', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            // Reset button state
            const submitBtn = apiTestForm.querySelector('.submit-btn');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Mock API call function
    async function mockApiCall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.apiKey === 'invalid') {
                    reject(new Error('Invalid API key'));
                }
                resolve({
                    imageUrls: [
                        "https://example.com/infographic-1.png",
                        "https://example.com/infographic-2.png"
                    ],
                    requestId: Math.random().toString(36).substring(7)
                });
            }, 1500);
        });
    }

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
});
