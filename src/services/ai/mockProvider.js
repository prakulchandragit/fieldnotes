import { AiServiceError } from './errors.js';
import { devControls } from './devControls.js';
import { CATEGORY_LABELS, GENERIC, SPECIES } from './mockSpecies.js';

const STAGES = ['Reading your description', 'Comparing your answers with sample species', 'Weighing how certain we can be'];

const abortError = () => new DOMException('Aborted', 'AbortError');
const wait = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(abortError());
  const t = setTimeout(resolve, ms);
  signal?.addEventListener('abort', () => { clearTimeout(t); reject(abortError()); }, { once: true });
});
const list = (items) => (items.length < 3 ? items.join(' and ') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`);

function explain({ top, runnerUp, answered, total, hasPhoto, named }) {
  const parts = [];
  if (!answered.length && !named) {
    parts.push('There was not enough detail to narrow this down.');
  } else {
    const matches = top.matches.map((a) => a.short);
    const misses = top.misses.map((a) => a.short);
    parts.push(matches.length ? `Your answers about ${list(matches)} fit ${top.sp.commonName}.` : `None of your answers clearly fit ${top.sp.commonName}.`);
    if (misses.length) parts.push(`Your answers about ${list(misses)} fit less well, which keeps this from being a firm match.`);
    if (runnerUp && top.conf - runnerUp.conf < 0.05) parts.push(`${runnerUp.sp.commonName} fits your answers almost equally well.`);
    if (answered.length < total) parts.push(`You were unsure about ${total - answered.length} question${total - answered.length > 1 ? 's' : ''}, so there is more room for error.`);
    parts.push('Several similar species share these traits, so treat this as a starting point to check, not an answer.');
  }
  if (hasPhoto) parts.push('Your photo is saved with the entry but was not analyzed.');
  return parts.join(' ');
}

function buildResult(obs) {
  const answered = obs.answers.filter((a) => a.value);
  const text = (obs.description || '').toLowerCase();
  const detailText = text.trim().length >= 8;
  const pool = SPECIES[obs.category] || [];
  const catLabel = CATEGORY_LABELS[obs.category] || 'Observation';
  const meta = { imageAnalyzed: false, generatedAt: new Date().toISOString() };
  const generic = GENERIC[obs.category] || GENERIC.other;

  const scored = pool.map((sp) => {
    const matches = answered.filter((a) => sp.keywords.includes(a.value));
    const misses = answered.filter((a) => !sp.keywords.includes(a.value));
    const mentions = sp.words.filter((w) => text.includes(w)).length;
    return { sp, matches, misses, raw: matches.length / Math.max(1, obs.answers.length) + Math.min(0.2, mentions * 0.1) };
  });
  const total = scored.reduce((s, x) => s + 0.08 + x.raw, 0) + 0.15;
  const evidence = Math.min(1, 0.4 + 0.2 * answered.length + (detailText ? 0.1 : 0));
  scored.forEach((x) => { x.conf = ((0.08 + x.raw) / total) * evidence; });
  scored.sort((a, b) => b.conf - a.conf);

  const top = scored[0];
  const named = Boolean(top) && top.conf >= 0.3 && (answered.length > 0 || detailText);
  const pct = (c) => Math.round(c * 100);
  const confidence = top && (answered.length || detailText) ? pct(top.conf) : null;
  const source = named ? top.sp : generic;

  return {
    id: `mock-${Date.now()}`,
    category: obs.category,
    categoryLabel: catLabel,
    commonName: named ? top.sp.commonName : null,
    scientificName: named ? top.sp.scientificName : null,
    possibleGroup: named ? top.sp.group : `${catLabel}, not yet narrowed down`,
    confidence,
    candidates: confidence === null ? [] : scored.map((x) => ({ commonName: x.sp.commonName, scientificName: x.sp.scientificName, confidence: pct(x.conf) })),
    uncertainty: explain({ top, runnerUp: scored[1], answered, total: obs.answers.length, hasPhoto: Boolean(obs.photo), named }),
    featuresAreGeneric: !named,
    features: source.features,
    habitat: source.habitat,
    facts: source.facts,
    followUp: source.followUp,
    meta,
  };
}

/** Mock provider: scores text answers against hard-coded species. It never looks at the photo. */
export const mockProvider = {
  id: 'mock',
  label: 'Mock provider (sample data)',
  isMock: true,
  async identify(observation, { signal, onProgress } = {}) {
    onProgress?.({ stage: 0, total: STAGES.length, label: STAGES[0] });
    for (let i = 0; i < STAGES.length; i += 1) {
      await wait(650, signal);
      if (i === 0 && devControls.failNext) {
        devControls.failNext = false;
        throw new AiServiceError('The sample provider was set to fail (development switch). Retrying should work.', { code: 'network' });
      }
      onProgress?.({ stage: i + 1, total: STAGES.length, label: STAGES[i + 1] || 'Finishing up' });
    }
    return buildResult(observation);
  },
};
