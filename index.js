require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "nvidia/nemotron-3.5-lightning:free";
const SYSTEM_PROMPT =
  "Kamu adalah asisten AI yang ramah dan membantu. Jawab dalam bahasa yang dipakai pengguna, singkat dan jelas.";

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", model: MODEL });
});

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Field 'messages' wajib berupa array dan tidak boleh kosong." });
  }
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY belum diatur di server." });
  }

  const history = messages
    .filter((m) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-20);
