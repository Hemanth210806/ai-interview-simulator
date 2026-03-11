const express = require("express");
const router = express.Router();
const axios = require("axios");
const pool = require("../config/db");

require("dotenv").config();

const API_KEY = process.env.GROQ_API_KEY;


// ===============================
// GET COMPANIES BASED ON PACKAGE
// ===============================
router.post("/companies", async (req, res) => {

  try {

    const pkg = req.body.package;

    const prompt = `Give 5 IT companies in India offering around ${pkg} salary package for freshers. Return only company names separated by new lines.`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;

    res.json({ companies: text });

  } catch (error) {

    console.error("AI Companies Error:", error.response?.data || error);
    res.status(500).json({ error: "AI error generating companies" });

  }

});


// ===============================
// GET QUESTIONS
// ===============================
router.post("/questions", async (req, res) => {

  try {

    const company = req.body.company;

    const prompt = `Give 5 technical interview questions asked in ${company} for software engineer freshers.`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;

    res.json({ questions: text });

  } catch (error) {

    console.error("AI Questions Error:", error.response?.data || error);
    res.status(500).json({ error: "AI error generating questions" });

  }

});


// ===============================
// EVALUATE ANSWER + SAVE RESULT
// ===============================
router.post("/evaluate", async (req, res) => {

  try {

    const { question, answer, usn } = req.body;

    const prompt = `
Question: ${question}

Student Answer: ${answer}

Evaluate the answer and provide:

Score out of 10
Feedback
Correct explanation
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = response.data.choices[0].message.content;

    // Extract score (example: 7/10)
    let scoreMatch = text.match(/(\d+)\/10/);
    let score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Save in database
    await pool.query(
      "INSERT INTO interview_results (usn, question, answer, score, feedback) VALUES (?, ?, ?, ?, ?)",
      [usn, question, answer, score, text]
    );

    res.json({ evaluation: text });

  } catch (error) {

    console.error("AI Evaluation Error:", error.response?.data || error);
    res.status(500).json({ error: "AI evaluation error" });

  }

});


// ===============================
// GET PERFORMANCE DATA
// ===============================
router.get("/performance/:usn", async (req, res) => {

  try {

    const usn = req.params.usn;

    const [rows] = await pool.query(
      "SELECT * FROM interview_results WHERE usn=? ORDER BY created_at DESC",
      [usn]
    );

    res.json(rows);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error fetching performance" });

  }

});


module.exports = router;