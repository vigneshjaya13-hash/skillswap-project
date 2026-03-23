const express = require('express');
const router = express.Router();

let GoogleGenAI;
try {
    const genaiModule = require('@google/genai');
    GoogleGenAI = genaiModule.GoogleGenAI;
} catch (e) {
    console.warn("@google/genai SDK not fully installed yet, it will fallback.");
}

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        let aiResponse = "";
        
        // Check if GEMINI_API_KEY is available and SDK exists
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "" && GoogleGenAI) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `You are a highly advanced AI assistant for the Skill Swap platform. 
User says: "${message}"
Respond in a helpful, conversational, and deeply knowledgeable way. Keep it relatively concise but extremely intelligent, like ChatGPT, Gemini, or Claude. Answer ANY question they ask fluently.`,
                });
                
                aiResponse = response.text;
            } catch (error) {
                console.error("Gemini API Error:", error);
                aiResponse = "I tried to use my advanced Gemini brain, but there was an error connecting to the API. 🧠⚠️";
            }
        } else {
            // High-quality fallback if no API key is provided
            console.log("No GEMINI_API_KEY found. Falling back to simulated high-quality bot.");
            const lowerMsg = message.toLowerCase();
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
                aiResponse = "Hello there! I'm your premium Skill Swap AI. I'm ready to act like ChatGPT or Gemini across ANY question once you securely add your `GEMINI_API_KEY` to the backend `.env` file! How can I help you today?";
            } else if (lowerMsg.includes("skill") || lowerMsg.includes("learn")) {
                aiResponse = "Skill swapping is a fantastic way to grow! You can head over to our Dashboard to explore 15+ default skills ranging from React to Personal Finance. (Add your Gemini API Key for me to give hyper-personalized skill recommendations!)";
            } else if (lowerMsg.includes("chatgpt") || lowerMsg.includes("gemini") || lowerMsg.includes("claude")) {
                aiResponse = "I have the core logic to answer exactly like Gemini and Claude! Just drop your `GEMINI_API_KEY` into the backend `.env` file, restart the server, and I'll unlock my full Web3/LLM capabilities to answer ANY question.";
            } else {
                aiResponse = `That's an interesting point about "${message}". To unlock my full advanced cognitive capabilities (like ChatGPT, Gemini, or Claude) to answer literally any question, simply provide your free Google Gemini API Key in the backend \`.env\` file. I have the @google/genai SDK already wired up and ready!`;
            }
        }

        res.json({ reply: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
