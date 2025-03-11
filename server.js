const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// ✅ Enable CORS for Firebase frontend & Render backend
app.use(cors({
  origin: ['https://byungdduggungf.web.app', 'https://byungdduggung-b.onrender.com'],
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// ✅ Ensure `score` table exists
const createTableQuery = `
CREATE TABLE IF NOT EXISTS score (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    similarity DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("❌ Error creating table:", err);
    } else {
        console.log("✅ Score table is ready!");
    }
});

// ✅ Debug log to confirm API routes are loading
console.log("🔍 Loading API routes...");

// ✅ Load API Routes
const scoreRoutes = require('./routes/scores');
app.use('/api', scoreRoutes);
console.log("✅ API Routes loaded: /api/scores");

// ✅ Handle requests to the root `/` route (Fixes 404 issue)
app.get('/', (req, res) => {
  res.send('🚀 Backend is running! Use /api/scores for data.');
});

// ✅ Handle 404 errors for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found", message: "This route does not exist." });
});

// ✅ Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
