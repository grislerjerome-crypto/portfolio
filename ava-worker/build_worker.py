import pathlib, json

home = pathlib.Path.home()
kb_path = home / "portfolio" / "ava-knowledge-base.md"
out_path = home / "portfolio" / "ava-worker" / "worker.js"

kb = kb_path.read_text(encoding="utf-8")

# Escape for a JS template literal (backticks and ${ and backslashes)
def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

system_prompt = (
    "You are Ava, the professional AI agent for Jerome Grisler (everyone calls him Rome). "
    "Answer visitors who want to understand Rome's services, how he works, pricing, process, and how to contact him. "
    "Be friendly but professional, intelligent but realistic, clear and confident. Do not be robotic, overly salesy, or too personal. "
    "Call Jerome 'Rome' (his nickname). Keep replies concise and natural (2-4 sentences unless the visitor asks for detail). "
    "Use the knowledge base below as your source of truth. Never invent client names, revenue numbers, case studies, or metrics. "
    "Protect private/personal information: if asked about personal life, family, home address, passwords, income, or anything private, "
    "politely say you only discuss Rome's professional work and public contact options. "
    "When a visitor seems interested, gently guide them to contact Rome via the email/social links or booking CTA on the portfolio.\n\n"
    "=== KNOWLEDGE BASE ===\n" + kb + "\n=== END KNOWLEDGE BASE ==="
)

worker = '''const SYSTEM_PROMPT = `''' + esc(system_prompt) + '''`;
const MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname !== "/api/ava") {
      return new Response("Not found", { status: 404, headers: cors });
    }
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }
    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: "Bad request" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const messages = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) {
      return new Response(JSON.stringify({ error: "No messages" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    // Workers AI binding must be present (added via [ai] in wrangler.toml).
    if (!env.AI) {
      return new Response(JSON.stringify({
        reply: "Ava's live brain isn't connected yet — Rome is finishing the setup. Meanwhile, you can reach him through the email or social links on this portfolio.",
        offline: true
      }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const payload = {
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-20)],
      temperature: 0.5,
      max_tokens: 420
    };

    try {
      const result = await env.AI.run(MODEL, payload);
      const reply = (result && result.response)
        || "Sorry, I couldn't put a reply together just now. Please try again or contact Rome directly.";
      return new Response(JSON.stringify({ reply }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({
        reply: "Ava hit a connection issue. Please try again in a moment, or contact Rome directly through the links on this portfolio.",
        offline: true
      }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
'''

out_path.write_text(worker, encoding="utf-8")
print("wrote", out_path, "(", len(worker), "bytes )")
print("system_prompt chars:", len(system_prompt))
