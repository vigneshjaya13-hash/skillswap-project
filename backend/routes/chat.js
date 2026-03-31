const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        // Fallback to free public Open LLM (Pollinations AI) if no GEMINI_API_KEY
        console.log('Sending message to AI:', message);
        
        const prompt = `You are a highly advanced AI assistant for the Skill Swap platform. 
User says: "${message}"
Respond in a helpful, conversational, and deeply knowledgeable way. Keep it relatively concise but extremely intelligent, like ChatGPT, Gemini, or Claude. Answer ANY question they ask fluently.`;

        // Use native fetch to get a response from Pollinations Text AI
        const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt));
        
        if (!response.ok) {
            throw new Error(`AI API returned ${response.status}`);
        }
        
        const aiResponse = await response.text();

        res.json({ reply: aiResponse });
    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ error: "I'm having a little trouble connecting to my AI brain right now. Please try again in a moment! 🧠⚠️" });
    }
});

module.exports = router;
