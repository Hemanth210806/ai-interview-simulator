const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullname, usn, password } = req.body;

    if (!fullname || !usn || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (fullname, usn, password) VALUES (?, ?, ?)",
      [fullname, usn, hashedPassword]
    );

    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { usn, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE usn = ?",
      [usn]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        usn: user.usn,
        fullname: user.fullname
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;