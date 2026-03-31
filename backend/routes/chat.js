const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        console.log('Sending message to AI:', message);
        
        const prompt = `You are a highly advanced AI assistant for the Skill Swap platform. 
User says: "${message}"
Respond in a helpful, conversational, and deeply knowledgeable way. Keep it relatively concise but extremely intelligent.`;

        // 8 second timeout mechanism
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt), {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`AI API returned ${response.status}`);
        }
        
        const aiResponse = await response.text();
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("AI API Error:", error.message);
        let errorMsg = "I'm having a little trouble connecting to my AI brain right now. Please try again in a moment! 🧠⚠️";
        
        if (error.name === 'AbortError') {
            errorMsg = "The AI network is extremely busy right now and took too long to answer! Try asking again. ⏳";
        }
        
        res.status(500).json({ error: errorMsg });
    }
});

module.exports = router;
