import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { CATEGORIES, todayLabel } from '../data/mock.js';
import Botanical from './Botanical.jsx';

export default function EntryCard({ entry, onDelete }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === entry.category);
  const r = entry.result;
  return (
    <article className="entry">
      <div className="entry__media">
        {entry.photo ? <img src={entry.photo} alt={entry.match || 'Observation'} /> : <Botanical name={cat?.art} size={64} />}
      </div>
      <div className="entry__body">
        <p className="kicker">{cat?.label} · {todayLabel(entry.date)}{entry.place ? ` · ${entry.place}` : ''}</p>
        <h3>{entry.match || 'Unidentified'}</h3>
        {entry.mock && <span className="tag">Sample result</span>}
        {entry.seed && <span className="tag">Example entry</span>}
        <p className={`entry__text ${open ? 'is-open' : ''}`}>{entry.description || 'No description written.'}</p>
        {entry.fieldNote && <p className="entry__note"><strong>After going out:</strong> {entry.fieldNote}</p>}
        {open && r && (
          <div className="entry__more">
            <p><strong>Certainty:</strong> {r.uncertainty}</p>
            <p><strong>Try next:</strong> {r.followUp}</p>
            {entry.analyzedBy && <p><strong>Analyzed by:</strong> {entry.analyzedBy}{entry.photoAnalyzed ? ' (photo read by the model)' : ' (words only)'}</p>}
          </div>
        )}
        <div className="entry__actions">
          <button type="button" className="link" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? 'Show less' : 'Read more'} <ChevronDown size={14} className={open ? 'flip' : ''} aria-hidden="true" />
          </button>
          {onDelete && <button type="button" className="link link--quiet" onClick={() => onDelete(entry.id)}><Trash2 size={14} aria-hidden="true" /> Delete</button>}
        </div>
      </div>
    </article>
  );
}
