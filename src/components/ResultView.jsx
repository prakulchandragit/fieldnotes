import { BookmarkPlus, Eye, ShieldCheck } from 'lucide-react';
import Button from './Button.jsx';
import ConfidenceBar from './ConfidenceBar.jsx';

const Section = ({ id, title, children, className = '' }) => (
  <section className={`panel ${className}`} aria-labelledby={id}><h2 id={id}>{title}</h2>{children}</section>
);

export default function ResultView({ draft, result, onSave }) {
  const { meta } = result;
  const others = result.commonName ? result.candidates.slice(1) : result.candidates;
  return (
    <article className="stack result">
      {meta.isMock && (
        <div className="banner" role="note">
          <strong>Sample result, not a real identification.</strong>{' '}
          It is built from hard-coded examples and your typed answers. {draft.photo ? 'Your photo was not analyzed.' : ''}
          {import.meta.env.DEV && <span className="banner__dev"> Provider: {meta.providerLabel}</span>}
        </div>
      )}
      {!meta.isMock && (
        <p className="provenance" role="note">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>
            Analyzed on this device by {meta.model}. {meta.imageAnalyzed ? 'The model looked at your photo; it never left your device.' : 'No photo was sent, so this rests on your words alone.'}{' '}
            AI can be wrong.{result.category !== 'birds' && result.category !== 'insects' ? ' Never eat or handle a plant or fungus based on this result.' : ''}
          </span>
        </p>
      )}
      <header className="heading">
        <p className="kicker">{result.possibleGroup}</p>
        <h1>{result.commonName || 'Not enough to name it yet'}</h1>
        {result.scientificName && <p className="latin">{result.scientificName}</p>}
      </header>

      <Section id="r-conf" title="How sure is this?">
        <ConfidenceBar value={result.confidence} qualitative={meta.qualitative} />
        <p>{result.uncertainty}</p>
        {others.length > 0 && (
          <>
            <h3 className="panel__sub">{result.commonName ? 'Other possibilities' : 'Closest possibilities'}</h3>
            <ul className="cands">
              {others.map((c) => (
                <li key={c.commonName}><span><strong className="serif">{c.commonName}</strong> <em>{c.scientificName}</em></span><ConfidenceBar value={c.confidence} qualitative={meta.qualitative} /></li>
              ))}
            </ul>
          </>
        )}
      </Section>

      <div className="two-col">
        <Section id="r-feat" title={result.featuresAreGeneric ? 'Features worth noting' : 'Distinguishing features'}>
          <ul className="bullets">{result.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </Section>
        <Section id="r-eco" title="Habitat and ecology">
          <p>{result.habitat}</p>
          <ul className="bullets">{result.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        </Section>
      </div>

      <section className="followup" aria-labelledby="r-next">
        <h2 id="r-next"><Eye size={18} aria-hidden="true" /> {result.quest ? `Go and look: ${result.quest.title}` : 'Try this next'}</h2>
        <p>{result.followUp}</p>
        {result.quest && <p className="followup__meta">About {result.quest.minutes} minutes, phone in your pocket.</p>}
      </section>

      <div className="row">
        <Button icon={BookmarkPlus} onClick={() => onSave(result)}>Save, then go and look</Button>
        <Button to={`observe/${draft.category}/edit`} variant="ghost">Add more detail</Button>
      </div>
    </article>
  );
}
