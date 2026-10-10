import { useEffect, useRef, useState } from 'react';
import { go } from '../lib/router.js';

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** Full-screen hand-off: show the quest once, then get out of the way. phase: brief | out | back */
export default function GoLook({ entry, onNote }) {
  const quest = entry?.result?.quest || {
    title: 'Look again',
    minutes: 5,
    prompt: entry?.result?.followUp || 'Stay where you are for five minutes and notice three more details of what you saw.',
  };
  const [phase, setPhase] = useState('brief');
  const [left, setLeft] = useState(quest.minutes * 60);
  const [note, setNote] = useState('');
  const endAt = useRef(0);
  const headRef = useRef(null);

  useEffect(() => { headRef.current?.focus(); }, [phase]);

  useEffect(() => {
    if (phase !== 'out') return undefined;
    // Compare against a wall-clock end time: background tabs throttle timers, so counting ticks drifts.
    const tick = () => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) { navigator.vibrate?.(200); setPhase('back'); }
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [phase]);

  if (!entry) {
    return (
      <div className="look"><div className="look__inner">
        <h1 ref={headRef} tabIndex={-1} className="look__title">That entry could not be found.</h1>
        <button type="button" className="look__btn" onClick={() => go('journal')}>Open journal</button>
      </div></div>
    );
  }

  const start = () => { endAt.current = Date.now() + quest.minutes * 60_000; setLeft(quest.minutes * 60); setPhase('out'); };
  const finish = (withNote) => { if (withNote && note.trim()) onNote(entry.id, note.trim()); go('journal'); };

  return (
    <div className={`look look--${phase}`}>
      <div className="look__inner">
        {phase === 'brief' && (
          <>
            <p className="look__small">Saved to your journal. Now, the best part.</p>
            <h1 ref={headRef} tabIndex={-1} className="look__title">{quest.title}</h1>
            <p className="look__prompt">{quest.prompt}</p>
            <p className="look__small">About {quest.minutes} minutes. The timer runs on its own, so you can lock your phone.</p>
            <div className="look__row">
              <button type="button" className="look__btn" onClick={start}>Phone away. Start.</button>
              <button type="button" className="look__link" onClick={() => go('journal')}>Skip to journal</button>
            </div>
          </>
        )}
        {phase === 'out' && (
          <>
            <h1 ref={headRef} tabIndex={-1} className="look__title look__title--quiet">Look up.</h1>
            <p className="look__clock" role="timer" aria-label={`${fmt(left)} remaining`}>{fmt(left)}</p>
            <p className="look__small">{quest.title}. You do not need to watch this screen.</p>
            <button type="button" className="look__link" onClick={() => setPhase('back')}>I am back early</button>
          </>
        )}
        {phase === 'back' && (
          <>
            <h1 ref={headRef} tabIndex={-1} className="look__title">Welcome back.</h1>
            <label className="look__field">
              <span>What did you notice? A line is plenty.</span>
              <textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything you saw, heard or wondered…" />
            </label>
            <div className="look__row">
              <button type="button" className="look__btn" onClick={() => finish(true)}>Add to journal</button>
              <button type="button" className="look__link" onClick={() => finish(false)}>Skip the note</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
