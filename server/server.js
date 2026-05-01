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
const demoRoutes = require('./routes/demo');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const adminRoutes = require('./routes/admin');

app.use('/api/auth',    authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);

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
