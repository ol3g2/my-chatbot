export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a helpful, concise AI assistant. Be friendly and clear.",
        messages
      })
    });

    const data = await response.json();
    const reply = data.content?.map(b => b.text).join("") || "Something went wrong.";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
