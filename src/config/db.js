const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 10,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected");
    connection.release();
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

testConnection();

module.exports = pool;