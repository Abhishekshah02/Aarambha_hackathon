require("dotenv").config();
const express = require("express");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateResponse(message) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error:", error);
    return "I'm sorry, I encountered an error. Please try again.";
  }
}

// Create a route to handle incoming chat messages
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const response = await generateResponse(message);
  res.json({ response: response });
});

// Serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
