const express = require("express");
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const fetch = global.fetch || ((...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args))
);

// 🔥 MODEL
const Chat = require("./models/Chat");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🔥 MAIN API
app.post("/api/correct", async (req, res) => {
  console.log("🔥 API HIT");

  const { message } = req.body;
  console.log("📩 Incoming:", message);

  if (!message || message.trim() === "") {
    return res.status(400).json({
      formal: "Please enter a message",
      informal: "Type something 😅",
    });
  }

  try {
    console.log("➡️ Calling AI...");

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: `
Convert the user input into:
1. Formal sentence
2. Informal sentence

Fix grammar and expand short phrases.

Return ONLY JSON:
{"formal":"...","informal":"..."}
              `,
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("⬅️ AI Response:", data);

    const content = data?.choices?.[0]?.message?.content;

    if (!content) throw new Error("No AI response");

    let parsed;

    try {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;

      if (!parsed) throw new Error("Invalid JSON");
    } catch {
      parsed = {
        formal: "Hello, how are you today?",
        informal: "Hey! What's up?",
      };
    }

    // 🔥 SAVE TO DB
    const saved = await Chat.create({
      message,
      formal: parsed.formal,
      informal: parsed.informal,
    });

    console.log("💾 Saved:", saved);

    res.json(parsed);

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    res.status(500).json({
      formal: "Server error",
      informal: "Something went wrong 😅",
    });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});