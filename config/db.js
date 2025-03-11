const mysql = require('mysql2');

console.log("🔍 Connecting to MySQL at:", process.env.DB_HOST, "on port", process.env.DB_PORT);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // Add this line!
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Stop the server if DB connection fails
  } else {
    console.log("✅ Successfully connected to MySQL!");
    connection.release();
  }
});

module.exports = db;
