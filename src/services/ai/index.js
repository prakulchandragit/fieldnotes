/**
 * AI identification service. UI code only imports `identifyObservation` from here.
 *
 * @typedef {{id:string, short:string, question:string, value:string, label:string}} Answer
 * @typedef {{category:string, photo:string|null, description:string, place:string, answers:Answer[]}} Observation
 * @typedef {{commonName:string|null, scientificName:string|null, possibleGroup:string, confidence:number|null,
 *   candidates:{commonName:string, scientificName:string, confidence:number}[], uncertainty:string,
 *   features:string[], habitat:string, facts:string[], followUp:string,
 *   meta:{isMock:boolean, imageAnalyzed:boolean, provider:string}}} IdentificationResult
 * @typedef {{id:string, label:string, isMock:boolean,
 *   identify:(o:Observation, opts?:{signal?:AbortSignal, onProgress?:(p:{stage:number,total:number,label:string})=>void})=>Promise<IdentificationResult>}} AiProvider
 *
 * Providers: 'gemma-ollama' (default, real, local) and 'mock' (sample data). Set VITE_AI_PROVIDER to switch.
 * A real provider is the only thing that should ever set meta.imageAnalyzed to true.
 */
import { AiServiceError } from './errors.js';
import { mockProvider } from './mockProvider.js';
import { gemmaProvider } from './gemmaProvider.js';

const PROVIDERS = { [mockProvider.id]: mockProvider, [gemmaProvider.id]: gemmaProvider };
// Default is the real Gemma provider. The mock is opt-in (VITE_AI_PROVIDER=mock) and never a silent fallback.
const DEFAULT_PROVIDER = gemmaProvider.id;

export function getProvider() {
  const id = import.meta.env.VITE_AI_PROVIDER || DEFAULT_PROVIDER;
  if (!PROVIDERS[id] && import.meta.env.DEV) console.warn(`Unknown AI provider "${id}", using ${DEFAULT_PROVIDER}.`);
  return PROVIDERS[id] || PROVIDERS[DEFAULT_PROVIDER];
}

/** @param {Observation} observation @returns {Promise<IdentificationResult>} */
export async function identifyObservation(observation, options = {}) {
  const hasInput = observation?.photo || observation?.description?.trim() || observation?.answers?.some((a) => a.value);
  if (!hasInput) throw new AiServiceError('Add a photo, a description or an answer first.', { code: 'invalid_input', retryable: false });
  const provider = getProvider();
  const raw = await provider.identify(observation, options);
  return { ...raw, meta: { ...raw.meta, provider: provider.id, providerLabel: provider.label, isMock: provider.isMock } };
}
