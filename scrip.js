// document.addEventListener('DOMContentLoaded', () => {
//   console.log('Script loaded');

//   // Select elements with proper null checks
//   const hamburger = document.querySelector('.hamburger');
//   const sidebar = document.querySelector('.sidebar');
//   const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
//   const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
//   const generateBtn = document.getElementById('generate-btn');
//   const editBtn = document.getElementById('edit-btn');
//   const downloadBtn = document.getElementById('download-btn');
//   const preview = document.getElementById('preview');
//   const userInput = document.getElementById('user-input');
//   const sourceSelect = document.getElementById('source');
//   const ratioSelect = document.getElementById('ratio');
//   const languageSelect = document.getElementById('language');

//   let remainingCredits = 5;
//   let generatedContent = null;

//   // Function to toggle mobile menu
//   function toggleMobileMenu() {
//     if (mobileMenuOverlay && sidebar) {
//       const isOpen = mobileMenuOverlay.classList.contains('active');
//       mobileMenuOverlay.classList.toggle('active');
//       sidebar.classList.toggle('active');
//       document.body.style.overflow = isOpen ? 'auto' : 'hidden';
//     }
//   }

//   // Attach mobile menu events
//   if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
//   if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
//   if (mobileMenuOverlay) {
//     mobileMenuOverlay.addEventListener('click', (e) => {
//       if (e.target === mobileMenuOverlay) {
//         toggleMobileMenu();
//       }
//     });
//   }
//   const menuItems = document.querySelectorAll('.mobile-nav a');
//   menuItems.forEach(item => {
//     item.addEventListener('click', () => {
//       if (window.innerWidth <= 768) toggleMobileMenu();
//     });
//   });

//   // Utility functions
//   function showNotification(message, type = 'info') {
//     const existingNotification = document.querySelector('.notification');
//     if (existingNotification) existingNotification.remove();
//     const notification = document.createElement('div');
//     notification.className = `notification ${type}`;
//     notification.textContent = message;
//     document.body.appendChild(notification);
//     setTimeout(() => notification.remove(), 3000);
//   }

//   function validateInput(content) {
//     if (!content) {
//       showNotification("Please enter valid text or URL.", 'error');
//       return false;
//     }
//     return true;
//   }

//   function updateCreditDisplay() {
//     const creditsElements = document.querySelectorAll('.credits p');
//     creditsElements.forEach(element => {
//       element.textContent = `${remainingCredits} Credits Left`;
//     });
//   }

//   // Render infographic from structured data
//   function renderInfographic(data) {
//     let iconsHTML = '';
//     let contentHTML = '';

//     data.icons.forEach(icon => {
//       iconsHTML += `<span class="icon">${icon}</span>`;
//     });
//     data.content.forEach(item => {
//       contentHTML += `<li>${item}</li>`;
//     });

//     preview.innerHTML = `
//       <div class="infographic-card">
//         <div class="infographic-preview">
//           <img src="${data.image}" alt="${data.title}">
//         </div>
//         <div class="infographic-details">
//           <h3>${data.title}</h3>
//           <p>${data.description}</p>
//           <div class="infographic-extras">
//             <div class="icons">${iconsHTML}</div>
//             <ul class="content-list">${contentHTML}</ul>
//           </div>
//           <span>Created on: ${new Date(data.date).toLocaleDateString()}</span>
//         </div>
//       </div>
//     `;
//     editBtn.disabled = false;
//     downloadBtn.disabled = false;
//   }

//   // New function to call the Gemini Flash API with the user input.
//   async function generateInfographicFromGemini(userContent) {
//     const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU";
//     const requestBody = {
//       contents: [{
//         parts: [{
//           text: "Generate structured content for infographic with font awesome icon, bullet point heading and bullet point content in 5 size array form for following requirements: " + userContent
//         }]
//       }]
//     };
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(requestBody)
//     });
//     const result = await response.json();
//     return result;
//   }

//   // Generate infographic using Gemini API
//   if (generateBtn) {
//     generateBtn.addEventListener('click', async () => {
//       console.log('Generate button clicked');
//       if (remainingCredits > 0) {
//         const content = userInput.value.trim();
//         const source = sourceSelect?.value;
//         const ratio = ratioSelect?.value;
//         const language = languageSelect?.value;

//         if (validateInput(content)) {
//           // Optional: You can store the parameters in generatedContent if needed.
//           generatedContent = { source, content, ratio, language };
          
//           // Show processing message
//           preview.innerHTML = `<p>Processing...</p>`;
          
//           try {
//             // Call Gemini Flash API
//             const aiResponse = await generateInfographicFromGemini(content);
//             console.log("Gemini API response:", aiResponse);

//             // Expect structure: { candidates: [ { output: "<JSON-string>", generatedText: "<JSON-string>", text: "<JSON-string>" } ] }
//             const candidate = aiResponse.candidates && aiResponse.candidates[0];
//             console.log("Candidate object:", candidate); // Debug log

//             // Try expected fields; if missing, fallback to stringifying the candidate
//             let candidateOutput = candidate 
//               ? (candidate.output || candidate.generatedText || candidate.text)
//               : null;
            
//             if (!candidateOutput) {
//               // As a fallback, attempt to stringify the candidate
//               candidateOutput = candidate ? JSON.stringify(candidate) : null;
//               console.error("Using stringified candidate as output:", candidateOutput);
//             }

//             if (!candidateOutput) {
//               throw new Error("No structured output from Gemini API");
//             }

//             let data;
//             try {
//               // Try parsing candidateOutput directly.
//               data = JSON.parse(candidateOutput);
//             } catch (directError) {
//               // Fallback using Cheerio if wrapped in HTML.
//               try {
//                 const $ = cheerio.load(candidateOutput);
//                 const outputText = $.text().trim();
//                 data = JSON.parse(outputText);
//               } catch (e) {
//                 throw new Error("Failed to parse structured data");
//               }
//             }

//             // Set fallback defaults if any keys are missing
//             data.title = data.title || "Generated Infographic";
//             data.description = data.description || "No description available.";
//             data.image = data.image || "default.jpg";
//             data.date = data.date || new Date();
//             data.icons = data.icons || ["icon1", "icon2", "icon3"];
//             data.content = data.content || ["content1", "content2", "content3"];

//             renderInfographic(data);
//           } catch (error) {
//             console.error(error);
//             preview.innerHTML = `<p class="error">Failed to generate infographic: ${error.message}</p>`;
//           }
//           remainingCredits--;
//           updateCreditDisplay();
//           showNotification(`Infographic generated! ${remainingCredits} credits remaining.`);
//         }
//       } else {
//         showNotification("You've used all free trials for today!", 'warning');
//       }
//     });
//   }

//   // Edit infographic button functionality (placeholder)
//   if (editBtn) {
//     editBtn.addEventListener('click', () => {
//       if (generatedContent) {
//         showNotification("Edit functionality in development", 'info');
//       } else {
//         showNotification("No infographic to edit", 'error');
//       }
//     });
//   }

//   // Download infographic button functionality (placeholder)
//   if (downloadBtn) {
//     downloadBtn.addEventListener('click', () => {
//       if (generatedContent) {
//         showNotification("Download started...", 'success');
//       } else {
//         showNotification("No infographic to download", 'error');
//       }
//     });
//   }

//   // Update input placeholder based on source type
//   if (sourceSelect) {
//     sourceSelect.addEventListener('change', (e) => {
//       if (userInput) {
//         userInput.placeholder = e.target.value === 'url'
//           ? 'Enter website URL...'
//           : 'Enter your text here...';
//       }
//     });
//   }

//   // Initial credit display update
//   updateCreditDisplay();
// });
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script loaded');

  const generateBtn = document.getElementById('generate-btn');
  const preview = document.getElementById('preview');
  const userInput = document.getElementById('user-input');
  const creditDisplay = document.querySelector('.credits p');

  let remainingCredits = 5;
  let generatedContent = null;

  // 🔹 Your API URL
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU";

  /** Displays notifications */
  function showNotification(message, type = "info") {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  /** Validates user input */
  function validateInput(content) {
    if (!content.trim()) {
      showNotification("Please enter valid text or URL.", "error");
      return false;
    }
    return true;
  }

  /** Updates the credit display */
  function updateCreditDisplay() {
    if (creditDisplay) creditDisplay.textContent = `${remainingCredits} Credits Left`;
  }

  /** Renders text-based responses */
  function renderTextResponse(text) {
    preview.innerHTML = `<p>${text}</p>`;
  }

  /** Renders JSON-based responses */
  function renderInfographic(data) {
    if (!Array.isArray(data)) {
      showNotification("Invalid data format received.", "error");
      return;
    }

    preview.innerHTML = ""; // Clear previous content

    data.forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.classList.add("infographic-section");

      // Icon
      const iconElement = document.createElement("i");
      iconElement.className = section.icon || "default-icon";
      sectionDiv.appendChild(iconElement);

      // Heading
      const headingElement = document.createElement(`h${section.heading?.size || 2}`);
      headingElement.textContent = section.heading?.text || "Untitled";
      headingElement.classList.add(`heading-size-${section.heading?.size || 2}`);
      sectionDiv.appendChild(headingElement);

      // Content
      const ulElement = document.createElement("ul");
      (section.content || []).forEach((item) => {
        const liElement = document.createElement("li");
        liElement.textContent = item.text || "No content";
        liElement.classList.add(`content-size-${item.size || 3}`);
        ulElement.appendChild(liElement);
      });
      sectionDiv.appendChild(ulElement);

      preview.appendChild(sectionDiv);
    });
  }

  /** Handles Generate Button Click */
  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      if (remainingCredits <= 0) {
        showNotification("No credits left!", "error");
        return;
      }

      const input = userInput.value.trim();
      if (!validateInput(input)) return;

      try {
        generateBtn.disabled = true;
        generateBtn.textContent = "Generating...";

        // Call Google Gemini API
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.json();

        if (result?.candidates?.length > 0) {
          const candidate = result.candidates[0];

          if (candidate?.content?.parts?.length > 0) {
            const responseText = candidate.content.parts[0].text;

            // Check if response is JSON or plain text
            try {
              const jsonData = JSON.parse(responseText);
              renderInfographic(jsonData);
              generatedContent = jsonData;
            } catch (error) {
              console.warn("Response is not JSON, displaying as text.");
              renderTextResponse(responseText);
              generatedContent = responseText;
            }

            remainingCredits--;
            updateCreditDisplay();
          } else {
            showNotification("No valid content received.", "error");
          }
        } else {
          showNotification("No candidates found in response.", "error");
        }
      } catch (error) {
        console.error("Error:", error);
        showNotification("An error occurred while generating.", "error");
      } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate";
      }
    });
  }
});



