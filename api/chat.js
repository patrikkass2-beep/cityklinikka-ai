import OpenAI from "openai";

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure your Vercel environment variable is set
});

// System prompt for the AI
const SYSTEM_PROMPT = `
You are an AI receptionist for Cityklinikka in Finland.
You help with laser teeth whitening bookings.

Rules:
- Be friendly and professional
- Always offer free consultation
- Ask which clinic: Helsinki or Turku
- Ask for name and phone number
- Do not give medical advice
`;

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
    });
    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
}
