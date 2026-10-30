const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const { GoogleGenAI } = require("@google/genai");

async function testGemini() {
  console.log("🔍 Testing Gemini API...");
  console.log("API Key exists:", process.env.GEMINI_API_KEY ? "YES (starts with " + process.env.GEMINI_API_KEY.substring(0, 8) + "...)" : "NO");
  
  if (!process.env.GEMINI_API_KEY) {
    console.log("❌ No API key found in .env");
    return;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    console.log("🔄 Sending test request to gemini-1.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: "Say 'Gemini API is fully connected and ready for TravelIndia!'",
    });
    
    console.log("✅ SUCCESS! Response:", response.text);
  } catch (error) {
    console.log("❌ FAILED!");
    console.log("Error status:", error.status);
    console.log("Error message:", error.message);
  }
}

testGemini();
