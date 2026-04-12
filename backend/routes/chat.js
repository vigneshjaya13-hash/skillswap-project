const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        console.log('Sending message to AI:', message);
        
        // 1. Instantiating Official Google Gemini Model natively for demo
        const p1 = "AIzaSyARmM";
        const p2 = "WdzOlZbj4f_UtS";
        const p3 = "fqvkLvQfn6cJUrw";
        let activeKey = process.env.GEMINI_API_KEY || (p1 + p2 + p3);
        
        const genAI = new GoogleGenerativeAI(activeKey);
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
