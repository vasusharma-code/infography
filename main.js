document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded");

  const generateBtn = document.getElementById("generate-btn");
  const preview = document.getElementById("preview");
  const userInput = document.getElementById("user-input");
  const creditDisplay = document.querySelector(".credits p");

  let remainingCredits = 5;

  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU";

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

  // Update the API call to include specific instructions for a visual infographic with images
  async function generateInfographicFromGemini(userContent) {
    const prompt = `Create a visually appealing infographic displaying the following information.
    
  Instructions:
  - Use a modern, colorful design.
  - Provide a catchy title.
  - Include 5 key sections. For each section, include a key point with icon, heading, description, and an image.
  - For each image, either provide a valid image URL or a base64 encoded image string.
  - Use a vertical layout with an attractive color scheme.
  
  Topic: ${userContent}
  
  Format your entire response strictly as JSON with no additional text and exactly with this structure (ensure valid JSON format):
  
  {
    "title": "Infographic Title",
    "theme": {
      "primary": "hex_color", 
      "secondary": "hex_color", 
      "accent": "hex_color"
    },
    "sections": [
      {
        "icon": "emoji or font-awesome-icon",
        "heading": "Section Heading",
        "content": "Section content text",
        "image": "image_url_or_base64"
      },
      // ... total exactly 5 sections
    ]
  }`;
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    return await response.json();
  }

  // Update the render function to create a visual infographic
  function renderInfographicImage(data) {
    preview.innerHTML = ""; // Clear previous content

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1200;

    // Apply theme colors
    const theme = data.theme || {
      primary: "#2563eb",
      secondary: "#f8fafc",
      accent: "#f97316"
    };

    // Draw background
    ctx.fillStyle = theme.secondary;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = theme.primary;
    ctx.font = "bold 36px Inter";
    ctx.textAlign = "center";
    ctx.fillText(data.title, canvas.width / 2, 80);

    let yOffset = 160;

    // Draw 5 sections
    data.sections.forEach((section, index) => {
      // Draw section background
      ctx.fillStyle = `${theme.primary}11`;
      ctx.fillRect(40, yOffset - 20, canvas.width - 80, 200);

      // Draw icon
      ctx.font = "32px Arial";
      ctx.fillStyle = theme.accent;
      ctx.textAlign = "left";
      ctx.fillText(section.icon, 60, yOffset + 30);

      // Draw heading
      ctx.font = "bold 24px Inter";
      ctx.fillStyle = theme.primary;
      ctx.fillText(section.heading, 120, yOffset + 30);

      // Draw content text word-wrapped
      ctx.font = "16px Inter";
      ctx.fillStyle = "#334155";
      const words = section.content.split(' ');
      let line = '';
      let contentY = yOffset + 60;
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 160) {
          ctx.fillText(line, 60, contentY);
          line = word + ' ';
          contentY += 25;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 60, contentY);

      // If section.image is provided, draw the image
      if (section.image) {
        const sectionImg = new Image();
        // Set up onload to draw image once loaded
        sectionImg.onload = () => {
          // Draw image to fill a portion of the section area
          // Adjust coordinates and dimensions as needed
          const imgWidth = 150;
          const imgHeight = 150;
          ctx.drawImage(sectionImg, canvas.width - imgWidth - 60, yOffset + 30, imgWidth, imgHeight);
        };
        sectionImg.src = section.image;
      }

      // Increase spacing for next section
      yOffset += 220;
    });

    // Convert canvas to image and display
    const image = new Image();
    image.src = canvas.toDataURL("image/png");
    preview.appendChild(image);

    // Enable download
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = 'infographic.png';
        link.href = image.src;
        link.click();
      };
    }

    // Function to call the MarkupGo API to generate a final image from a URL.
// In this implementation we use the current page URL as the source - adjust as needed.
function generateFinalImage() {
  const markupAPIKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const sourceUrl = window.location.href; // Or set the URL of your infographic page
  fetch('https://api.markupgo.com/api/v1/image', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': markupAPIKey
    },
    body: JSON.stringify({
      source: {
        type: 'url',
        url: sourceUrl
      },
      options: {
        // Add image options here if needed, for example:
        format: "png",
        quality: 90,
        // width, height, etc.
      }
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Final screenshot payload:", data);
    if (data.url) {
      // Replace preview with the final image from MarkupGo
      const finalImg = new Image();
      finalImg.src = data.url;
      finalImg.alt = "Final Infographic Screenshot";
      preview.innerHTML = "";
      preview.appendChild(finalImg);
    } else {
      console.error("No image URL returned from MarkupGo");
    }
  })
  .catch(error => console.error('Error generating final image:', error));
}
    // Now, call the external screenshot API to generate a final, colorful infographic image
    generateFinalImage();
  }

  // Add this function before the generate button click handler
  function convertToInfographic(text) {
    // Split text into sections and create a structured format
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract title from first line or use default
    const title = lines[0] || "Generated Infographic";
    
    // Generate sections from remaining lines
    const sections = [];
    let currentSection = null;
    
    lines.slice(1).forEach(line => {
      // Remove any bullet points or numbers at start of line
      const cleanLine = line.replace(/^[-•*\d.)\s]+/, '').trim();
      
      if (cleanLine.length > 0) {
        if (line.startsWith(' ') || line.startsWith('\t')) {
          // This is content for the current section
          if (currentSection) {
            currentSection.content += ' ' + cleanLine;
          }
        } else {
          // This is a new section
          currentSection = {
            icon: '📌', // Default icon
            heading: cleanLine,
            content: '',
            image: '' // Default empty image
          };
          sections.push(currentSection);
        }
      }
    });

    // Ensure we have at least one section
    if (sections.length === 0) {
      sections.push({
        icon: '📝',
        heading: 'Summary',
        content: text,
        image: ''
      });
    }

    // Return structured data in the expected format
    return {
      title,
      theme: {
        primary: "#2563eb",
        secondary: "#f8fafc",
        accent: "#f97316"
      },
      sections
    };
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

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        });

        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const result = await response.json();

        // In your Generate button click handler, update the candidate parsing:
        if (result?.candidates?.length > 0) {
          const candidate = result.candidates[0];
          if (candidate?.content?.parts?.length > 0) {
            const responseText = candidate.content.parts[0].text;
            let infographicData;
            try {
              // Parse the JSON response (expecting an object, not an array)
              infographicData = JSON.parse(responseText);
            } catch (error) {
              console.warn("Response is not valid JSON, converting to infographic.");
              infographicData = convertToInfographic(responseText);
            }
            renderInfographicImage(infographicData);
            remainingCredits--;
            updateCreditDisplay();
          } else {
            showNotification("No valid infographic data received.", "error");
          }
        } else {
          showNotification("No infographic candidates found.", "error");
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

