document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  const generateBtn = document.getElementById("generate-btn");
  const preview = document.getElementById("preview");
  const userInput = document.getElementById("user-input");
  const creditDisplay = document.querySelector(".credits p");
  let remainingCredits = 5;

  const GEMINI_API_KEY = "AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU";
  const MARKUPGO_API_KEY = "d1fcd56a-5879-4d76-9c9b-60a0d9c7b425";
  // Gemini API endpoint
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  /** 🔔 Show Notifications */
  function showNotification(message, type = "info") {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  /** ✅ Validate Input */
  function validateInput(content) {
    if (!content.trim()) {
      showNotification("Please enter valid text or URL.", "error");
      return false;
    }
    return true;
  }

  /** 🎯 Update Credit Display */
  function updateCreditDisplay() {
    if (creditDisplay) creditDisplay.textContent = `${remainingCredits} Credits Left`;
  }

  /**
   * 🖌️ Generate Infographic JSON Using Gemini  
   * The prompt now instructs the AI to return strict JSON with "title", "icons" and "content" keys.
   */
  async function generateInfographicFromGemini(userContent) {
    const prompt = `Create an infographic based on the topic: "${userContent}".
Return the result strictly as valid JSON (with no extra text) in the following format:
{
  "title": "Infographic Title",
  "icons": ["icon1", "icon2", "icon3"],
  "content": ["Section 1 content", "Section 2 content", "Section 3 content"]
}`;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const result = await response.json();
      if (result?.candidates?.length > 0) {
        // Assume the candidate returns JSON text in candidate.content.parts[0].text
        const responseText = result.candidates[0]?.content?.parts?.[0]?.text;
        try {
          const data = JSON.parse(responseText);
          return data;
        } catch (error) {
          showNotification("Failed to parse JSON from AI response.", "error");
          return null;
        }
      } else {
        showNotification("No valid infographic data found.", "error");
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error generating infographic.", "error");
      return null;
    }
  }

  /**
   * 📸 Capture a Screenshot Using MarkupGo  
   * Pass the deployed template URL as the source, then capture and display the screenshot.
   */
  function captureScreenshot(deployedUrl) {
    fetch("https://api.markupgo.com/api/v1/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MARKUPGO_API_KEY
      },
      body: JSON.stringify({
        source: {
          type: "url",
          url: deployedUrl
        },
        options: {
          format: "png",
          quality: 90,
          viewport: { width: 800, height: 1200 }
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          const finalImg = new Image();
          finalImg.src = data.url;
          finalImg.alt = "Final Infographic Screenshot";
          preview.innerHTML = "";
          preview.appendChild(finalImg);
        } else {
          showNotification("Failed to generate final image.", "error");
        }
      })
      .catch(error => {
        console.error("Error generating final image:", error);
        showNotification("Error processing final image.", "error");
      });
  }

  /**
   * 🚀 Handle Generate Button Click  
   * Retrieve data from Gemini, build the deployed template URL using query strings,
   * and then capture a screenshot of that deployed page.
   */
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
        const infographicData = await generateInfographicFromGemini(input);
        if (infographicData) {
          // Build query string parameters (using "||" as a delimiter for arrays)
          const title = encodeURIComponent(infographicData.title);
          const icons = encodeURIComponent(infographicData.icons.join("||"));
          const content = encodeURIComponent(infographicData.content.join("||"));

          // Construct the deployed template URL (update with your actual Netlify URL)
          const deployedUrl = `https://your-netlify-site.netlify.app/templates.html?title=${title}&icons=${icons}&content=${content}`;
          
          // Capture screenshot of the deployed page and display in preview area
          captureScreenshot(deployedUrl);
          remainingCredits--;
          updateCreditDisplay();
          showNotification("Infographic generated successfully!", "success");
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
