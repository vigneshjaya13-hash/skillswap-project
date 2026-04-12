const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        console.log('Sending message to AI:', message);
        const msgLower = message.toLowerCase();
        
        // 1. INTELLIGENT LOCAL HEURISTIC AI (100% Reliable for Demo)
        if (msgLower.includes('how') && (msgLower.includes('post') || msgLower.includes('add') || msgLower.includes('create'))) {
            return res.json({ reply: "To post a skill or request, simply go to your Dashboard and click the 'Add Skill' button at the top right! Fill out the form and it will be live immediately! 🚀" });
        }
        if (msgLower.includes('what') && msgLower.includes('skillswap')) {
            return res.json({ reply: "SkillSwap is a revolutionary peer-to-peer platform where users can offer skills they know, and request skills they want to learn. No money involved—just exchanging knowledge! 🧠🤝" });
        }
        if (msgLower.includes('who') && (msgLower.includes('build') || msgLower.includes('made') || msgLower.includes('creator'))) {
            return res.json({ reply: "This platform was built as an advanced DBMS and Fullstack web project! It uses a highly scalable TiDB cloud database, React, and Node.js. 🌟" });
        }
        if (msgLower.includes('hello') || msgLower.includes('hi ')) {
            return res.json({ reply: "Hello! I'm your SkillSwap Artificial Intelligence. I can help you navigate the platform, learn how to trade skills, or answer any technical questions. How can I assist you today? 🤖" });
        }
        
        // 2. FALLBACK TO CLOUD AI
        const prompt = `You are a highly advanced AI assistant for the Skill Swap platform. 
User says: "${message}"
Respond in a helpful, conversational, and deeply knowledgeable way. Keep it relatively concise but extremely intelligent.`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // reduced to 6s to be snappy

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
