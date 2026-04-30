const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
const authRoutes   = require('./routes/auth');
const schoolRoutes = require('./routes/schools');

app.use('/api/auth',    authRoutes);
app.use('/api/schools', schoolRoutes);

// Health check
app.get('/', (req, res) => res.send('UltimateSchool API is running.'));

// ── Database ───────────────────────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err.message));
