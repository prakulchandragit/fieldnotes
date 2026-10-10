// Structured-output schema for Gemma plus the guardrails applied to whatever it returns.
// The model is asked to hedge; this file makes hedging non-optional.
import { CATEGORY_LABELS } from './mockSpecies.js';

export const LIKELIHOODS = ['unlikely', 'possible', 'probable'];
// Qualitative bands, not measured probabilities. The UI hides the number for these (meta.qualitative).
const BAND_VALUE = { unlikely: 12, possible: 38, probable: 62 };
const OVERCONFIDENT = /\b(definitely|certainly|undoubtedly|100 ?%|for sure|without (?:a )?doubt|no doubt|guaranteed)\b/i;

const text = (type, extra = {}) => ({ type, ...extra });
export const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    photo_usable: text('boolean'),
    group: text('string'),
    what_i_can_see: text('array', { items: text('string'), maxItems: 5 }),
    what_is_missing: text('array', { items: text('string'), maxItems: 4 }),
    candidates: text('array', {
      minItems: 1,
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          common_name: text('string'),
          scientific_name: text('string'),
          likelihood: text('string', { enum: LIKELIHOODS }),
        },
        required: ['common_name', 'scientific_name', 'likelihood'],
      },
    }),
    uncertainty: text('string'),
    habitat: text('string'),
    facts: text('array', { items: text('string'), maxItems: 2 }),
    quest: {
      type: 'object',
      properties: { title: text('string'), minutes: text('integer'), prompt: text('string') },
      required: ['title', 'minutes', 'prompt'],
    },
  },
  required: ['photo_usable', 'group', 'what_i_can_see', 'what_is_missing', 'candidates', 'uncertainty', 'habitat', 'facts', 'quest'],
};

const str = (v, max = 400) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const strs = (v, max) => (Array.isArray(v) ? v.map((x) => str(x, 220)).filter(Boolean).slice(0, max) : []);
const dropOverconfident = (s) => s.split(/(?<=[.!?])\s+/).filter((x) => !OVERCONFIDENT.test(x)).join(' ');
const joinList = (items) => (items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

/** Throws a plain Error if the payload is unusable; otherwise returns a guarded result. */
export function normalizeGemma(raw, { category, photoSent }) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.candidates)) throw new Error('Gemma reply missing candidates');

  const photoOk = !photoSent || raw.photo_usable !== false;
  const seen = strs(raw.what_i_can_see, 5);
  const missing = strs(raw.what_is_missing, 4);

  // Candidates: cleaned, de-duplicated, bands capped by the evidence available.
  const maxBand = photoSent ? 2 : 1; // without a photo, nothing may exceed "possible"
  const unique = new Map();
  raw.candidates.forEach((c) => {
    const commonName = str(c?.common_name, 80);
    if (!commonName || unique.has(commonName.toLowerCase())) return;
    const sci = str(c?.scientific_name, 80);
    const idx = Math.max(0, LIKELIHOODS.indexOf(c?.likelihood));
    unique.set(commonName.toLowerCase(), {
      commonName,
      scientificName: /^[A-Z][a-z]+ [a-z-]+/.test(sci) ? sci : '',
      band: photoOk ? Math.min(idx, maxBand) : 0,
    });
  });
  let cands = [...unique.values()].slice(0, 3);
  if (cands.filter((c) => c.band === 2).length > 1) cands.forEach((c) => { if (c.band === 2) c.band = 1; }); // two "probables" contradict
  if (seen.length < 3) cands.forEach((c) => { if (c.band === 2) c.band = 1; }); // "probable" needs real visible evidence
  cands = cands.map((c, i) => ({ ...c, i })).sort((a, b) => b.band - a.band || a.i - b.i);

  const top = cands[0];
  const named = Boolean(top) && top.band >= 1 && seen.length >= 2;
  const catLabel = CATEGORY_LABELS[category] || 'Observation';

  const parts = [];
  if (photoSent && !photoOk) parts.push('The photo is not clear enough to rely on.');
  if (!photoSent) parts.push('No photo was analyzed, so this rests on your words alone.');
  const model = dropOverconfident(str(raw.uncertainty, 600));
  if (model) parts.push(model);
  if (missing.length) parts.push(`To be more sure, look for: ${joinList(missing)}.`);
  parts.push('Treat this as a starting point to check against a field guide, not an answer.');

  const q = raw.quest || {};
  let prompt = str(q.prompt, 320) || 'Stay where you are for five minutes and notice three more details of what you just saw.';
  if (!/phone|screen/i.test(prompt)) prompt += ' Keep your phone in your pocket.';
  const quest = {
    title: str(q.title, 60) || 'Look again',
    minutes: Math.min(20, Math.max(3, Math.round(Number(q.minutes)) || 8)),
    prompt,
  };

  return {
    category,
    categoryLabel: catLabel,
    commonName: named ? top.commonName : null,
    scientificName: named && top.scientificName ? top.scientificName : null,
    possibleGroup: str(raw.group, 90) || `${catLabel}, not yet narrowed down`,
    confidence: top ? BAND_VALUE[LIKELIHOODS[top.band]] : null,
    candidates: cands.map((c) => ({ commonName: c.commonName, scientificName: c.scientificName, confidence: BAND_VALUE[LIKELIHOODS[c.band]] })),
    uncertainty: parts.join(' '),
    featuresAreGeneric: !named,
    features: seen.length ? seen : ['Nothing distinctive could be confirmed from what was provided'],
    habitat: str(raw.habitat, 400) || 'Habitat could not be inferred from this observation.',
    facts: strs(raw.facts, 2),
    followUp: quest.prompt,
    quest,
  };
}
