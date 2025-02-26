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
