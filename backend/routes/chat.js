const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        console.log('Sending message to AI:', message);
        
        // 1. Check for API Key configured in Render Env Vars
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                reply: "Hello! My Gemini AI upgrade is almost complete. The administrator just needs to paste the free GEMINI_API_KEY into the Render environment variables to activate my intelligence! 🧠✨" 
            });
        }

        // 2. Instantiate Official Google Gemini Model
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an incredibly smart, highly advanced AI assistant for a peer-to-peer web application called "Skill Swap". 
This platform was built as a DBMS and Fullstack Web course project.
The user's message is below. Respond conversationally, format it nicely, and be extremely helpful.
User says: "${message}"`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.json({ reply: "I am connected to Gemini Cloud, but there was a temporary processing error processing your request. Please try again! ⏳" });
    }
});

module.exports = router;
