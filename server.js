require("dotenv").config();
console.log("EMAIL:", process.env.EMAIL);
console.log("APP_PASSWORD:", process.env.APP_PASSWORD ? "SET" : "NOT SET");
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

// ✅ CORS for local + Vercel frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://portfolio-frontend.vercel.app" // change after Vercel deploy if URL differs
  ]
}));

app.use(express.json());

// ✅ Health check route (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Gmail SMTP transporter (Render-safe)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

// ✅ Contact form route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "🚀 New Portfolio Inquiry",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mail error:", error);
    res.status(500).json({ success: false });
  }
});

// ✅ Render requires this
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
