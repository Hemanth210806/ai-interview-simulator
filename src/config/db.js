const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({

  host: process.env.DB_HOST || "mysql.railway.internal",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "railway",
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0

});

// Test DB connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database Connection Failed:", err.message);
  }
}

testConnection();

module.exports = pool;