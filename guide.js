document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const sidebar = document.querySelector('.sidebar');

    // Mobile menu toggle
    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            mobileMenuOverlay.style.display = mobileMenuOverlay.style.display === 'block' ? 'none' : 'block';
            sidebar.classList.toggle('active');
            document.body.style.overflow = mobileMenuOverlay.style.display === 'block' ? 'hidden' : 'auto';
        }
    }

    // Newsletter subscription
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            // Simulated API call
            await subscribeToNewsletter(email);
            showFormMessage('Successfully subscribed! Check your email.', 'success');
            newsletterForm.reset();
        } catch (error) {
            showFormMessage(error.message, 'error');
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }

    // Blog data
    const articles = [
        {
            id: 1,
            title: 'How to Enhance Your LinkedIn Posts with Infographic Magic',
            excerpt: "In today's digital world, capturing your audience's attention requires more than just well-written content...",
            image: 'og.png',
            tags: ['LinkedIn Marketing', 'Infographics'],
            date: 'Oct 29, 2024'
        },
        {
            id: 2,
            title: 'How to Boost Your Pinterest Traffic with Infographics',
            excerpt: 'Learn how to use infographics to boost your Pinterest marketing...',
            image: 'og.png',
            tags: ['Pinterest Marketing', 'Traffic Growth'],
            date: 'Oct 14, 2024'
        }
        // Add more articles here
    ];

    // Tag management
    const tags = [...new Set(articles.flatMap(article => article.tags))];
    const tagsContainer = document.getElementById('tags-container');
    let activeTag = null;

    function renderTags() {
        tagsContainer.innerHTML = tags.map(tag => `
            <div class="tag ${activeTag === tag ? 'active' : ''}" data-tag="${tag}">
                ${tag}
            </div>
        `).join('');

        // Add tag click listeners
        document.querySelectorAll('.tag').forEach(tagElement => {
            tagElement.addEventListener('click', () => {
                const tag = tagElement.dataset.tag;
                activeTag = activeTag === tag ? null : tag;
                renderTags();
                renderArticles();
            });
        });
    }

    // Article rendering
    function renderArticles() {
        const filteredArticles = activeTag 
            ? articles.filter(article => article.tags.includes(activeTag))
            : articles;

        const articlesGrid = document.getElementById('articles-grid');
        articlesGrid.innerHTML = filteredArticles.map(article => `
            <article class="article-card">
                <img src="${article.image}" alt="${article.title}" class="article-image">
                <div class="article-content">
                    <div class="article-tags">
                        ${article.tags.map(tag => `
                            <span class="article-tag">${tag}</span>
                        `).join('')}
                    </div>
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">${article.date}</div>
                </div>
            </article>
        `).join('');
    }

    // Mock API call
    async function subscribeToNewsletter(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email.includes('test')) {
                    reject(new Error('Invalid email address'));
                } else {
                    resolve({ success: true });
                }
            }, 1000);
        });
    }

    // Initialize
    renderTags();
    renderArticles();

    // Event Listeners
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
});