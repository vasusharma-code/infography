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
            { id: 1, name: 'Business Report', image: './templates/h1.png' },
            { id: 2, name: 'Market Analysis', image: './templates/h2.png' },
            { id: 3, name: 'Timeline', image: './templates/h3.png' },
            { id: 4, name: 'Comparison Chart', image: './templates/h4.png' },
            { id: 5, name: 'Process Flow', image: './templates/h5.png' },
            { id: 6, name: 'Statistics Dashboard', image: './templates/h6.png' },
            { id: 7, name: 'Feature Overview', image: './templates/h7.png' },
            { id: 8, name: 'Data Visualization', image: './templates/h8.png' },
            { id: 9, name: 'Industry Trends', image: './templates/h9.png' },
            { id: 10, name: 'Product Showcase', image: './templates/h10.png' }
        ],
        vertical: [
            { id: 11, name: 'Social Media Story', image: './templates/v1.png' },
            { id: 12, name: 'Mobile Timeline', image: './templates/v2.png' },
            { id: 13, name: 'Step by Step Guide', image: './templates/v3.png' },
            { id: 14, name: 'Product Features', image: './templates/v4.png' },
            { id: 15, name: 'Quick Facts', image: './templates/v5.png' },
            { id: 16, name: 'Bio Template', image: './templates/v6.png' },
            { id: 17, name: 'Case Study', image: './templates/v7.png' },
            { id: 18, name: 'Recipe Card', image: './templates/v8.png' },
            { id: 19, name: 'Daily Schedule', image: './templates/v9.png' },
            { id: 20, name: 'Achievement List', image: './templates/v10.png' }
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

    // Function to open a full-screen overlay for the clicked template image.
    function openFullscreen(imageSrc, templateName) {
        // Create overlay element with close button outside fs-content
        const overlay = document.createElement("div");
        overlay.id = "fullscreen-overlay";
        overlay.innerHTML = `
          <button id="fs-close" aria-label="Close Fullscreen">&times;</button>
          <div class="fs-content">
              <img src="${imageSrc}" alt="${templateName}">
          </div>
        `;
        document.body.appendChild(overlay);

        // Close overlay when clicking the close button
        document.getElementById("fs-close").addEventListener("click", () => {
            document.body.removeChild(overlay);
        });

        // Close overlay when clicking outside the content area
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // Attach event listener on the templates grid
    templatesGrid.addEventListener("click", (e) => {
        // Check if the clicked target is an image inside a template preview.
        if(e.target.tagName.toLowerCase() === "img") {
            const imageSrc = e.target.getAttribute("src");
            const templateName = e.target.alt || "";
            openFullscreen(imageSrc, templateName);
        }
    });

    // Function to open the template modal with options (Source dropdown, Input field, and Generate button)
    function openTemplateModal(templateName) {
        // Create modal overlay element
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "template-modal-overlay";
        modalOverlay.innerHTML = `
          <div id="template-modal">
             <button id="modal-close" aria-label="Close Modal">&times;</button>
             <h2>Customize Template: ${templateName}</h2>
             <form id="template-form">
               <label for="template-source">Select Source:</label>
               <select id="template-source">
                 <option value="url">URL</option>
                 <option value="topic">Topic</option>
                 <option value="content">Content</option>
               </select>
               <br/><br/>
               <label for="template-input">Enter your input:</label>
               <input type="text" id="template-input" placeholder="Enter your URL, topic, or content here..." required />
               <br/><br/>
               <button type="submit" id="modal-generate">Generate</button>
             </form>
             <div id="modal-result"></div>
          </div>
        `;
        document.body.appendChild(modalOverlay);

        // Close modal handler
        document.getElementById("modal-close").addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        // Handle form submission (generate infographic using Gemini API)
        document.getElementById("template-form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const source = document.getElementById("template-source").value;
            const inputValue = document.getElementById("template-input").value.trim();
            if (!inputValue) return;

            // Show processing in modal
            document.getElementById("modal-result").innerHTML = `<p>Processing...</p>`;

            try {
                // Call your server endpoint (adjust payload as needed)
                const response = await fetch('/api/scrape', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: inputValue })  // Optionally include source if your backend supports it.
                });
                if (!response.ok) throw new Error('API error');
                const data = await response.json();

                // Render result in modal (you might enhance this further based on your infographic markup)
                document.getElementById("modal-result").innerHTML = `
                  <div class="infographic-card">
                     <div class="infographic-preview">
                         <img src="${data.image}" alt="${data.title}">
                     </div>
                     <div class="infographic-details">
                         <h3>${data.title}</h3>
                         <p>${data.description}</p>
                         <div class="infographic-extras">
                            <div class="icons">${data.icons.map(icon => `<span class="icon">${icon}</span>`).join('')}</div>
                            <ul class="content-list">${data.content.map(item => `<li>${item}</li>`).join('')}</ul>
                         </div>
                         <span>Created on: ${new Date(data.date).toLocaleDateString()}</span>
                     </div>
                  </div>
                `;
            } catch (error) {
                console.error(error);
                document.getElementById("modal-result").innerHTML = `<p class="error">Failed to generate infographic: ${error.message}</p>`;
            }
        });
    }

    // Attach event listener to "Use Template" buttons
    // We'll use event delegation on templatesGrid; check if the clicked element has the "use-template-btn" class.
    templatesGrid.addEventListener("click", (e) => {
        if (e.target.classList.contains("use-template-btn")) {
            e.preventDefault();
            // Get the template name from the parent element (or use e.target's attribute)
            const templateCard = e.target.closest(".template-card");
            const templateName = templateCard ? templateCard.querySelector(".template-details h3").textContent : "Template";
            openTemplateModal(templateName);
        }
    });
});