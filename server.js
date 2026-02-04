require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

/* -------------------- Resend Setup -------------------- */
const resend = new Resend(process.env.RESEND_API_KEY);

/* -------------------- CORS (Vercel + Local) -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://buildwithsaksham.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

/* -------------------- Health Route -------------------- */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* -------------------- Send Mail Function -------------------- */
async function sendMail(name, email, message) {
  await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: process.env.EMAIL,
    subject: "🚀 New Portfolio Inquiry",
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });
}

/* -------------------- Contact Route -------------------- */
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await sendMail(name, email, message);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false });
  }
});

/* -------------------- Start Server -------------------- */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
