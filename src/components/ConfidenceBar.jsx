const label = (n) => (n >= 55 ? 'Probable' : n >= 20 ? 'Possible' : 'Unlikely');

// `qualitative` results come from a model's own judgement, not a measured probability, so no percentage is shown.
export default function ConfidenceBar({ value, qualitative = false }) {
  if (value == null) return <p className="conf__label">Not enough detail to estimate</p>;
  const text = qualitative ? `${label(value)} (Gemma's own estimate)` : `${label(value)} · about ${value}%`;
  return (
    <div className="conf" role="img" aria-label={text}>
      <div className="conf__track"><div className="conf__fill" style={{ width: `${value}%` }} /></div>
      <span className="conf__label">{text}</span>
    </div>
  );
}
