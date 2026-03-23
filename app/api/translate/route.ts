/* app/api/translate/route.ts */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, medium, location } = body;

    const prompt = `You are a professional art translator specialized in sacred and Byzantine art.
Translate these Arabic artwork fields into English.
Return ONLY a valid JSON object with keys: title, medium, location.
No markdown, no explanation — just raw JSON.

title: "${title || ""}"
medium: "${medium || ""}"
location: "${location || ""}"`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const raw = (data.content ?? [])
      .filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("");

    const clean = raw.replace(/```(?:json)?|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Translate error:", e);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}