import { AiServiceError } from './errors.js';
import { RESPONSE_SCHEMA, normalizeGemma } from './schema.js';

const MODEL = import.meta.env.VITE_GEMMA_MODEL || 'gemma4:e4b';
// Browsers cannot call Ollama directly (CORS), so Vite proxies /ollama -> http://localhost:11434.
const BASE = import.meta.env.VITE_OLLAMA_BASE || '/ollama';
const TIMEOUT_MS = 180_000; // CPU-only laptops can be slow on the first request (model load)

const STAGES = ['Preparing your observation', 'Gemma is looking closely, on this device', 'Checking the answer for overconfidence'];

const SYSTEM = `You are the field-guide assistant inside Fieldnotes, an app that helps people learn to observe birds, plants, insects and other wildlife. You are not an identification authority.
Rules:
- Describe only what is visibly present in the photo or stated by the person. Never invent markings you cannot see.
- Give 1 to 3 candidates, most likely first. Use likelihood "probable" only when several distinct visible features agree and close look-alikes are unlikely. Use "possible" when plausible, "unlikely" for long shots. Never claim a species is certain.
- If the photo is blurry, distant or lacks the features needed, set photo_usable to false.
- In what_is_missing list specific extra observations that would separate the candidates (for example: wing count, underside of the leaf, bill shape).
- Never advise eating, tasting, touching or handling any plant, fungus or animal.
- The quest is a short task (3 to 15 minutes) to do outdoors WITHOUT using a phone, using eyes, ears or careful stillness. It must be specific to this observation, safe, free, and must not need a photo. Tell the person to put the phone away.
- Use plain, warm language. Reply with JSON matching the schema and nothing else.`;

function buildUserText(obs) {
  const answered = obs.answers.filter((a) => a.value).map((a) => `- ${a.question} ${a.label}`);
  return [
    `Category the person chose: ${obs.category}.`,
    obs.description ? `Their description: ${obs.description}` : 'They wrote no description.',
    obs.place ? `Place: ${obs.place}` : '',
    answered.length ? `Their answers:\n${answered.join('\n')}` : 'They were unsure about every question.',
    obs.photo ? 'A photo is attached.' : 'No photo is attached; rely only on the words above and rate every candidate accordingly.',
  ].filter(Boolean).join('\n');
}

const abortError = () => new DOMException('Aborted', 'AbortError');

async function callOllama(body, signal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('timeout')), TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  let res;
  try {
    res = await fetch(`${BASE}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal });
  } catch (err) {
    if (signal?.aborted) throw abortError();
    if (controller.signal.aborted) throw new AiServiceError('Gemma took too long to answer. The first request loads the model and can be slow; try again.', { code: 'network' });
    throw new AiServiceError('Could not reach Ollama. Start it with "ollama serve" (and run the app with "npm run dev"), then try again.', { code: 'network' });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
  if (res.status === 404) throw new AiServiceError(`The model "${MODEL}" is not installed. Run: ollama pull ${MODEL}`, { code: 'model_unavailable', retryable: false });
  if (!res.ok) throw new AiServiceError(`Ollama returned an error (${res.status}). Check that your Ollama version supports Gemma 4.`, { code: 'unknown' });
  return res.json();
}

export const gemmaProvider = {
  id: 'gemma-ollama',
  label: `Gemma 4 (${MODEL}) via local Ollama`,
  isMock: false,
  async identify(observation, { signal, onProgress } = {}) {
    onProgress?.({ stage: 0, total: STAGES.length, label: STAGES[0] });
    const photoSent = Boolean(observation.photo);
    const userMsg = { role: 'user', content: buildUserText(observation) };
    if (photoSent) userMsg.images = [observation.photo.split(',')[1]]; // strip the data-URL prefix

    onProgress?.({ stage: 1, total: STAGES.length, label: STAGES[1] });
    const started = performance.now();
    const data = await callOllama({
      model: MODEL,
      stream: false,
      think: false,
      format: RESPONSE_SCHEMA,
      // Sampling values recommended on Google's Gemma 4 model card.
      options: { temperature: 1.0, top_p: 0.95, top_k: 64 },
      messages: [{ role: 'system', content: SYSTEM }, userMsg],
    }, signal);

    onProgress?.({ stage: 2, total: STAGES.length, label: STAGES[2] });
    let parsed;
    try { parsed = JSON.parse(data?.message?.content ?? ''); }
    catch { throw new AiServiceError('Gemma replied in an unexpected format. Trying again usually fixes this.', { code: 'unknown' }); }
    let result;
    try { result = normalizeGemma(parsed, { category: observation.category, photoSent }); }
    catch { throw new AiServiceError('Gemma\'s answer was incomplete. Trying again usually fixes this.', { code: 'unknown' }); }

    return {
      id: `gemma-${Date.now()}`,
      ...result,
      meta: { imageAnalyzed: photoSent, qualitative: true, model: MODEL, latencyMs: Math.round(performance.now() - started), generatedAt: new Date().toISOString() },
    };
  },
};
