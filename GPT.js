require("dotenv").config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API key is correctly set in .env
});

async function analyzeBill(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Analyze this medical bill and find errors, overcharges, and suggestions." },
        { role: "user", content: text }
      ]
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error in analyzing:", err);
  }
}

module.exports = { analyzeBill };
