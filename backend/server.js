const express = require('express');
const cors = require('cors');
require('dotenv').config();

const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// Groq client (Free AI)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post('/explain', async (req, res) => {
  const text = req.body.text;
  const language = req.body.language || "English";

  // =====================================================
  // BODO MODE (Manual – No AI)
  // =====================================================
  if (language === "Bodo") {

    // Extract number from input (example: Hemoglobin 9.5)
    const numberMatch = text.match(/(\d+(\.\d+)?)/);
    const value = numberMatch ? parseFloat(numberMatch[0]) : null;

    let status = "unknown";

    if (value !== null) {
      if (value < 12) status = "low";
      else if (value > 16) status = "high";
      else status = "normal";
    }

    let explanation = "";

    if (status === "low") {
      explanation = `
सारांश:
Nwngni Hemoglobin gwdan (low).

मुख्य बिंदु:
Value: ${value}

अर्थ:
Nwngni bodi jwngnai, thangnai ba jwngnai thakhai.

सलाह:
Doctor jwngon.

Disclaimer:
Medical advice naya.
`;
    }
    else if (status === "normal") {
      explanation = `
सारांश:
Nwngni Hemoglobin normal.

मुख्य बिंदु:
Value: ${value}

अर्थ:
Gwsw jwngnai.

सलाह:
Healthy khanai thangnai.

Disclaimer:
Medical advice naya.
`;
    }
    else if (status === "high") {
      explanation = `
सारांश:
Nwngni Hemoglobin gwdan fwthar (high).

मुख्य बिंदु:
Value: ${value}

अर्थ:
Blood problem thangnai thangnai.

सलाह:
Doctor jwngon.

Disclaimer:
Medical advice naya.
`;
    }
    else {
      explanation = "Data bujwya jwngnai.";
    }

    return res.json({ explanation });
  }

  // =====================================================
  // ENGLISH / HINDI MODE (AI)
  // =====================================================
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a medical information assistant.

Explain the given medical text in simple ${language}.

Use this exact format:

Summary:
- Simple explanation

Key Points:
- Important values or findings

What it may indicate:
- General meaning only (no diagnosis)

Advice:
- General advice such as consulting a doctor

Disclaimer:
This is not medical advice. Please consult a healthcare professional.
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const explanation = completion.choices[0].message.content;

    res.json({ explanation });

  } catch (error) {
    console.error(error);
    res.json({ explanation: "Error getting AI response" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});