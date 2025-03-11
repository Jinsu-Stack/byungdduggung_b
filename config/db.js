const mysql = require('mysql2');

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "your-mysql-host",
  user: process.env.DB_USER || "your-username",
  password: process.env.DB_PASSWORD || "your-password",
  database: process.env.DB_NAME || "railway", // Change to railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL database:", process.env.DB_NAME || "railway");
  connection.release();
});

module.exports = db;
