require("dotenv").config();

const express = require("express");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const aiRoutes = require("./src/routes/ai");

const app = express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==============================
// STATIC FILES
// ==============================

app.use(express.static(path.join(__dirname, "public")));


// ==============================
// ROUTES
// ==============================

app.use("/api/auth", authRoutes);
app.use("/api/student", aiRoutes);


// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});