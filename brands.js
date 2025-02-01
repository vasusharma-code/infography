document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');

    // Brand management elements
    const createBrandBtn = document.getElementById('create-brand-btn');
    const createBrandModal = document.getElementById('create-brand-modal');
    const brandForm = document.getElementById('brand-form');
    const closeModalBtn = document.querySelector('.close-modal');
    const watermarkTypeInputs = document.getElementsByName('watermark-type');
    const watermarkTextInput = document.getElementById('watermark-text-input');
    const watermarkImageInput = document.getElementById('watermark-image-input');
    const brandColorInput = document.getElementById('brand-color');
    const colorHexInput = document.getElementById('color-hex');
    const imagePreview = document.getElementById('image-preview');
    const emptyState = document.getElementById('empty-state');
    const brandsGrid = document.getElementById('brands-grid');

    // State management
    let brands = JSON.parse(localStorage.getItem('brands')) || [];

    // Toggle mobile menu
    function toggleMobileMenu() {
        if (mobileMenuOverlay) {
            const isOpen = mobileMenuOverlay.style.display === 'block';
            mobileMenuOverlay.style.display = isOpen ? 'none' : 'block';
            document.body.style.overflow = isOpen ? 'auto' : 'hidden';
        }
    }

    // Make showCreateBrandModal global
    window.showCreateBrandModal = function() {
        const createBrandModal = document.getElementById('create-brand-modal');
        if (createBrandModal) {
            createBrandModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    // Make hideCreateBrandModal global
    window.hideCreateBrandModal = function() {
        const createBrandModal = document.getElementById('create-brand-modal');
        if (createBrandModal) {
            createBrandModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    // Modal management
    function showCreateBrandModal() {
        createBrandModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function hideCreateBrandModal() {
        createBrandModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        brandForm.reset();
        imagePreview.innerHTML = '';
    }

    // Toggle watermark input types
    function toggleWatermarkInputs(type) {
        watermarkTextInput.style.display = type === 'text' ? 'block' : 'none';
        watermarkImageInput.style.display = type === 'image' ? 'block' : 'none';
    }

    // Color input sync
    function syncColorInputs(value) {
        brandColorInput.value = value;
        colorHexInput.value = value;
    }

    // Image preview
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Watermark preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    // Form validation
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.brandName.trim()) {
            errors.push('Brand name is required');
        }

        if (formData.watermarkType === 'text' && !formData.watermarkText.trim()) {
            errors.push('Watermark text is required');
        }

        if (formData.watermarkType === 'image' && !formData.watermarkImage) {
            errors.push('Watermark image is required');
        }

        if (!formData.brandColor.match(/^#[0-9A-F]{6}$/i)) {
            errors.push('Invalid color format');
        }

        return errors;
    }

    // Save brand
    function saveBrand(brand) {
        brands.push(brand);
        localStorage.setItem('brands', JSON.stringify(brands));
        updateBrandsDisplay();
        hideCreateBrandModal();
        showNotification('Brand created successfully!', 'success');
    }

    // Update brands display
    function updateBrandsDisplay() {
        if (brands.length === 0) {
            emptyState.style.display = 'block';
            brandsGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            brandsGrid.style.display = 'grid';
            renderBrands();
        }
    }

    // Render brands grid
    function renderBrands() {
        brandsGrid.innerHTML = brands.map((brand, index) => `
            <div class="brand-card">
                <div class="brand-preview" style="background-color: ${brand.brandColor}">
                    ${brand.watermarkType === 'text' 
                        ? `<p>${brand.watermarkText}</p>`
                        : `<img src="${brand.watermarkImage}" alt="${brand.brandName} logo">`
                    }
                </div>
                <div class="brand-details">
                    <h3>${brand.brandName}</h3>
                    <p>Fonts: ${brand.headingFont}, ${brand.subheadingFont}, ${brand.contentFont}</p>
                    <button onclick="deleteBrand(${index})" class="secondary-btn">Delete</button>
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
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (createBrandBtn) createBrandBtn.addEventListener('click', showCreateBrandModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', hideCreateBrandModal);

    watermarkTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => toggleWatermarkInputs(e.target.value));
    });

    brandColorInput.addEventListener('input', (e) => syncColorInputs(e.target.value));
    colorHexInput.addEventListener('input', (e) => syncColorInputs(e.target.value));
    
    document.getElementById('watermark-image-file')
        .addEventListener('change', handleImageUpload);

    // Form submission
    brandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            brandName: document.getElementById('brand-name').value,
            watermarkType: document.querySelector('input[name="watermark-type"]:checked').value,
            watermarkText: document.getElementById('watermark-text-content').value,
            watermarkImage: imagePreview.querySelector('img')?.src || '',
            brandColor: brandColorInput.value,
            headingFont: document.getElementById('heading-font').value,
            subheadingFont: document.getElementById('subheading-font').value,
            contentFont: document.getElementById('content-font').value
        };

        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            showNotification(errors[0], 'error');
            return;
        }

        saveBrand(formData);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === createBrandModal) {
            hideCreateBrandModal();
        }
    });

    // Initial render
    updateBrandsDisplay();
});