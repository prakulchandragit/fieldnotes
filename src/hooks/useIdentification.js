import { useCallback, useEffect, useState } from 'react';
import { identifyObservation } from '../services/ai/index.js';

const LOADING = { status: 'loading', stage: 0, total: 3, label: 'Getting started' };

/** Runs identification for a draft observation. Status: idle | loading | success | error. */
export function useIdentification(draft) {
  const [state, setState] = useState(draft ? LOADING : { status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!draft) return undefined;
    const controller = new AbortController();
    setState(LOADING);
    identifyObservation(draft, {
      signal: controller.signal,
      onProgress: (p) => setState((s) => (s.status === 'loading' ? { ...s, ...p } : s)),
    })
      .then((result) => setState({ status: 'success', result }))
      .catch((error) => { if (error?.name !== 'AbortError') setState({ status: 'error', error }); });
    return () => controller.abort();
  }, [draft, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { ...state, retry };
}
