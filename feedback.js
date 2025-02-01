
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const createPostBtn = document.getElementById('createPostBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackForm = document.getElementById('feedbackForm');
    const closeModalBtn = document.querySelector('.close-modal');
    const feedbackPosts = document.getElementById('feedbackPosts');

    // Get stored feedback
    let feedbackList = JSON.parse(localStorage.getItem('feedback')) || [];

    // Show modal
    function showModal() {
        feedbackModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Hide modal
    window.hideModal = function() {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        feedbackForm.reset();
    }

    // Create feedback post
    function createFeedbackPost(data) {
        const feedback = {
            id: Date.now(),
            ...data,
            timestamp: new Date().toISOString(),
            author: 'Vasu Sharma',
            status: 'Open'
        };

        feedbackList.unshift(feedback);
        localStorage.setItem('feedback', JSON.stringify(feedbackList));
        renderFeedbackPosts();
        hideModal();
        showNotification('Feedback submitted successfully!', 'success');
    }

    // Render feedback posts
    function renderFeedbackPosts() {
        if (feedbackList.length === 0) {
            feedbackPosts.innerHTML = `
                <div class="empty-state">
                    <h3>No feedback yet</h3>
                    <p>Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }

        feedbackPosts.innerHTML = feedbackList.map(feedback => `
            <div class="feedback-card">
                <div class="feedback-header">
                    <h3 class="feedback-title">${feedback.title}</h3>
                    <span class="feedback-category category-${feedback.category}">${feedback.category}</span>
                </div>
                <p class="feedback-description">${feedback.description}</p>
                <div class="feedback-meta">
                    <span>${feedback.author} • ${new Date(feedback.timestamp).toLocaleString()}</span>
                    <span>Status: ${feedback.status}</span>
                </div>
            </div>
        `).join('');
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Event Listeners
    createPostBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            category: document.getElementById('category').value
        };

        if (!formData.title || !formData.description) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        createFeedbackPost(formData);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === feedbackModal) {
            hideModal();
        }
    });

    // Mobile menu functionality (reuse from main script)
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            const isOpen = mobileMenuOverlay.style.display === 'block';
            mobileMenuOverlay.style.display = isOpen ? 'none' : 'block';
            document.body.style.overflow = isOpen ? 'auto' : 'hidden';
        }
    }

    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Initial render
    renderFeedbackPosts();
});