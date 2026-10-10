// Smoke test: is Ollama up, is the model installed, and can it read an image and return our JSON schema?
// Usage: node scripts/check-gemma.mjs [path/to/photo.jpg]
import { readFileSync } from "node:fs";

const HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const MODEL = process.env.VITE_GEMMA_MODEL || "gemma4:e2b";
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
};

let tags;
try {
  tags = await (await fetch(`${HOST}/api/tags`)).json();
} catch {
  fail(
    `Cannot reach Ollama at ${HOST}. Install it from https://ollama.com and run "ollama serve".`,
  );
}
if (!tags.models?.some((m) => m.name === MODEL || m.name === `${MODEL}:latest`))
  fail(`Model not installed. Run: ollama pull ${MODEL}`);
console.log(`ok  Ollama reachable, ${MODEL} installed`);

const photo = process.argv[2];
const message = {
  role: "user",
  content: photo
    ? 'Describe what is in this photo in one sentence, as JSON {"description": string}.'
    : 'Reply with JSON {"description": "ok"}.',
};
if (photo) message.images = [readFileSync(photo).toString("base64")];
const t0 = Date.now();
const res = await fetch(`${HOST}/api/chat`, {
  method: "POST",
  body: JSON.stringify({
    model: MODEL,
    stream: false,
    think: false,
    format: {
      type: "object",
      properties: { description: { type: "string" } },
      required: ["description"],
    },
    messages: [message],
  }),
});
if (!res.ok) fail(`/api/chat returned ${res.status}: ${await res.text()}`);
const out = JSON.parse((await res.json()).message.content);
console.log(
  `ok  structured output in ${((Date.now() - t0) / 1000).toFixed(1)}s${photo ? " (with image)" : " (text only; pass a photo to test vision)"}`,
);
console.log(out);
