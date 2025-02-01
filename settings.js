document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.style.display = mobileMenuOverlay.style.display === 'block' ? 'none' : 'block';
            if (sidebar) sidebar.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.style.display === 'block' ? 'hidden' : 'auto';
        }
    }

    // Attach event listeners for mobile menu
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                toggleMobileMenu();
            }
        });
    }

    // Elements for Account Management
    const generateApiKeyBtn = document.getElementById('generateApiKey');
    const apiKeyInput = document.getElementById('apiKey');
    const copyApiKeyBtn = document.getElementById('copyApiKey');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const passwordForm = document.getElementById('passwordForm');
    const deleteForm = document.getElementById('deleteForm');

    // Generate API Key
    function generateApiKey() {
        const key = 'ak_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        return key;
    }

    generateApiKeyBtn.addEventListener('click', () => {
        const newKey = generateApiKey();
        apiKeyInput.value = newKey;
        showNotification('New API key generated successfully', 'success');
    });

    // Copy API Key
    copyApiKeyBtn.addEventListener('click', () => {
        if (!apiKeyInput.value) {
            showNotification('No API key to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(apiKeyInput.value)
            .then(() => showNotification('API key copied to clipboard', 'success'))
            .catch(() => showNotification('Failed to copy API key', 'error'));
    });

    // Password Change
    changePasswordBtn.addEventListener('click', () => {
        openModal('passwordModal');
    });

    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }

        // Mock password update
        showNotification('Password updated successfully', 'success');
        closeModal('passwordModal');
        passwordForm.reset();
    });

    // Delete Account
    deleteAccountBtn.addEventListener('click', () => {
        openModal('deleteModal');
    });

    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const confirmation = document.getElementById('deleteConfirmation').value;

        if (confirmation !== 'DELETE') {
            showNotification('Please type DELETE to confirm', 'error');
            return;
        }

        // Mock account deletion
        showNotification('Account deleted successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });

    // Modal Functions
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Notification Function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
});
