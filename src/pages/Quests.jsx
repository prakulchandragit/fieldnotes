import { Check, Clock } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import Button from '../components/Button.jsx';
import { QUESTS } from '../data/mock.js';

export default function Quests({ done, onToggle }) {
  const pct = Math.round((done.length / QUESTS.length) * 100);
  return (
    <>
      <PageHeading kicker="Field quests" title="Small challenges, outdoors.">Each takes a few minutes. Do them with your eyes, not your screen.</PageHeading>
      <div className="progress" aria-label={`${done.length} of ${QUESTS.length} complete`}>
        <div className="progress__bar"><div style={{ width: `${pct}%` }} /></div>
        <span>{done.length} of {QUESTS.length} complete</span>
      </div>
      <ul className="quests">
        {QUESTS.map((q) => {
          const isDone = done.includes(q.id);
          return (
            <li key={q.id} className={`quest ${isDone ? 'is-done' : ''}`}>
              <div>
                <p className="kicker"><Clock size={13} /> {q.minutes} min</p>
                <h2>{q.title}</h2>
                <p>{q.prompt}</p>
              </div>
              <div className="row">
                <Button variant={isDone ? 'ghost' : 'primary'} icon={Check} onClick={() => onToggle(q.id)}>{isDone ? 'Completed' : 'Mark done'}</Button>
                <Button to={`observe/${q.category}`} variant="ghost">Log a find</Button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
