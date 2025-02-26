const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// API endpoint that calls the Gemini Flash API
app.post('/api/scrape', async (req, res) => {
  const { content } = req.body;
  try {
    // Build the Gemini Flash API request
    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDYGuO7Q2LSPUIyuKzlQKLMvj_5ltr6hAU';
    const payload = {
      contents: [{
        parts: [{
          text: "Generate structured content for infographic with font awesome icon, bullet point heading and bullet point content in 5 size array form for following requirements: " + content
        }]
      }]
    };

    // Call the Gemini Flash API
    const apiResponse = await axios.post(geminiUrl, payload, {
      headers: { "Content-Type": "application/json" }
    });

    // Expecting response format: { candidates: [ { output: "<JSON-string or HTML wrapped JSON>" } ] }
    const candidate = apiResponse.data.candidates && apiResponse.data.candidates[0];
    if (!candidate || !candidate.output) {
      throw new Error("No structured output from Gemini API");
    }

    // Use Cheerio to try to extract text if the output is wrapped in HTML.
    let data;
    try {
      // Try parsing candidate.output directly.
      data = JSON.parse(candidate.output);
    } catch (directError) {
      try {
        // Use Cheerio to load the candidate output (in case it contains HTML tags)
        const $ = cheerio.load(candidate.output);
        const outputText = $.text().trim();
        data = JSON.parse(outputText);
      } catch (e) {
        throw new Error("Failed to parse structured data");
      }
    }
    
    // Fallback defaults if any keys are missing
    data.title = data.title || "Generated Infographic";
    data.description = data.description || "No description available.";
    data.image = data.image || "default.jpg";
    data.date = data.date || new Date();
    data.icons = data.icons || ["icon1", "icon2", "icon3"];
    data.content = data.content || ["content1", "content2", "content3"];
    
    res.json(data);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate content: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

