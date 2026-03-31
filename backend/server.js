const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initializeDatabase } = require('./config/db');

// Route imports
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const swapRoutes = require('./routes/swaps');
const chatRoutes = require('./routes/chat');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/chat', chatRoutes);

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Serve static frontend in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing, return all requests to React app
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Database initialization & Server start
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API Server running on port ${PORT}`);
    });
});
