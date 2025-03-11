const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors({
  origin: ['https://byungdduggungf.web.app', 'https://byungdduggung-b.onrender.com'],
  methods: "GET,POST",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());

// Ensure the `score` table exists
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

// Load API routes
const scoreRoutes = require('./routes/scores');
app.use('/api', scoreRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
