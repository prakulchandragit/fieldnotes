import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import PhotoPicker from '../components/PhotoPicker.jsx';
import QuestionGroup from '../components/QuestionGroup.jsx';
import StepIndicator from '../components/StepIndicator.jsx';
import { CATEGORIES } from '../data/mock.js';
import { QUESTIONS } from '../data/questions.js';
import { go } from '../lib/router.js';
import { devControls } from '../services/ai/devControls.js';

export default function Observe({ category, prefill, onSubmit }) {
  const cat = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const questions = QUESTIONS[cat.id];
  const start = prefill?.category === cat.id ? prefill : null;

  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(start?.photo ?? null);
  const [description, setDescription] = useState(start?.description ?? '');
  const [place, setPlace] = useState(start?.place ?? '');
  const [picked, setPicked] = useState(() => Object.fromEntries((start?.answers || []).map((a) => [a.id, a.value])));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const topRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) topRef.current?.focus(); else mounted.current = true;
    window.scrollTo(0, 0);
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 0) {
      if (busy) { setError('Your photo is still being prepared. One moment.'); return; }
      if (!photo && description.trim().length < 5) { setError('Add a photo or write a few words about what you see.'); return; }
      setError(''); setStep(1); return;
    }
    const answers = questions.map((q) => {
      const opt = q.options.find((o) => o.value === picked[q.id]);
      return { id: q.id, short: q.short, question: q.prompt, value: opt?.value || '', label: opt?.label || 'Not sure' };
    });
    onSubmit({ category: cat.id, photo, description: description.trim(), place: place.trim(), answers });
    go('result');
  };

  return (
    <form onSubmit={handleSubmit} className="stack" noValidate>
      <div ref={topRef} tabIndex={-1} className="focus-top">
        <StepIndicator steps={['Capture', 'Questions']} current={step} />
        <PageHeading kicker={`Field observation · ${cat.label}`} title={step === 0 ? 'Look closely first.' : 'A few quick questions.'}>
          {step === 0 ? 'Add a photo, describe what you see, or both.' : 'Answer what you can. Choose "Not sure" when you are not, since honest gaps make for honest results.'}
        </PageHeading>
      </div>

      {step === 0 ? (
        <div className="split">
          <PhotoPicker photo={photo} onChange={setPhoto} onBusyChange={setBusy} onError={setError} />
          <div className="stack stack--tight">
            <label className="field"><span>What do you notice?</span>
              <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Colour, shape, sound, movement, where it was…" />
            </label>
            <label className="field"><span>Where are you? <em>(optional)</em></span>
              <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Garden path, ridge trail…" autoComplete="off" />
            </label>
          </div>
        </div>
      ) : (
        <div className="stack stack--tight">
          {questions.map((q) => (
            <QuestionGroup key={q.id} question={q} value={picked[q.id]} onChange={(v) => setPicked((p) => ({ ...p, [q.id]: v }))} />
          ))}
          {import.meta.env.DEV && (
            <label className="devbox"><input type="checkbox" onChange={(e) => { devControls.failNext = e.target.checked; }} /> Dev: make the mock provider fail once (to test retry)</label>
          )}
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}
      <div className="row">
        {step === 1 && <button type="button" className="btn btn--ghost" onClick={() => setStep(0)}><ArrowLeft size={18} aria-hidden="true" /> Back</button>}
        <button type="submit" className="btn btn--primary">
          <span>{step === 0 ? 'Continue' : 'Analyze observation'}</span>
          {step === 0 ? <ArrowRight size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}
