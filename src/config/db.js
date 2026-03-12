const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL);

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    conn.release();
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

testConnection();

module.exports = pool;