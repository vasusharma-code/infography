document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  const generateBtn = document.getElementById("generate-btn");
  const preview = document.getElementById("preview");
  const userInput = document.getElementById("user-input");
  const creditDisplay = document.querySelector(".credits p");

  let remainingCredits = 5;

  const GEMINI_API_KEY = "AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU";
  const MARKUPGO_API_KEY = "d1fcd56a-5879-4d76-9c9b-60a0d9c7b425";
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

  /** 🖌️ Generate Infographic HTML Using Gemini */
  async function generateInfographicFromGemini(userContent) {
    const prompt = `Create an infographic in **HTML format** based on this topic: "${userContent}".
    The HTML should include:
    - A **main title** inside an <h1> tag.
    - A **consistent color theme** using inline styles.
    - Multiple **sections** with icons, headings, and content.
    - Use **<div> containers** to structure the infographic.
    - DO NOT include <html>, <head>, or <body> tags.
    - The result should be a valid **standalone HTML snippet**.`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt.replace("${userContent}", userContent) }] }],
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();

      // ✅ Check if the response contains valid HTML
      if (result?.candidates?.length > 0) {
        const responseText = result.candidates[0]?.content?.parts?.[0]?.text;

        if (responseText.includes("<div") || responseText.includes("<h1")) {
          return responseText.trim();
        } else {
          showNotification("Invalid HTML response from AI. Try again.", "error");
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

  /** 🎨 Render Infographic HTML */
  function renderInfographicHTML(htmlContent) {
    preview.innerHTML = htmlContent; // Directly insert the generated HTML into preview
    generateFinalImage(preview.innerHTML);
  }

  /** 🖼️ Convert Infographic HTML to Image using MarkupGo */
  function generateFinalImage(htmlContent) {
    fetch("https://api.markupgo.com/api/v1/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": MARKUPGO_API_KEY,
      },
      body: JSON.stringify({
        source: {
          type: "html",
          data: htmlContent, // Send full HTML to MarkupGo
        },
        options: {
          format: "png",
          quality: 90,
          viewport: { width: 800, height: 1200 },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        console.error("Error generating final image:", error);
        showNotification("Error processing final image.", "error");
      });
  }

  /** 🚀 Handle Generate Button Click */
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

        const infographicHTML = await generateInfographicFromGemini(input);
        if (infographicHTML) {
          renderInfographicHTML(infographicHTML);
          remainingCredits--;
          updateCreditDisplay();
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
