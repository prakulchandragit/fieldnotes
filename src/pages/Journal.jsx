import { useState } from 'react';
import PageHeading from '../components/PageHeading.jsx';
import EntryCard from '../components/EntryCard.jsx';
import Button from '../components/Button.jsx';
import { CATEGORIES } from '../data/mock.js';

export default function Journal({ entries, onDelete }) {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? entries : entries.filter((e) => e.category === filter);
  return (
    <>
      <PageHeading kicker="Journal" title="Things you've noticed.">{entries.filter((e) => !e.seed).length} of your own observations so far. Notes are stored on this device.</PageHeading>
      <div className="chips" role="group" aria-label="Filter by category">
        {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => (
          <button key={c.id} type="button" className={`chip ${filter === c.id ? 'is-on' : ''}`} aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
      </div>
      {shown.length === 0 ? (
        <div className="empty"><p className="serif">Nothing here yet.</p><Button to="explore">Make an observation</Button></div>
      ) : (
        <div className="entries">{shown.map((e) => <EntryCard key={e.id} entry={e} onDelete={e.seed ? null : onDelete} />)}</div>
      )}
    </>
  );
}
