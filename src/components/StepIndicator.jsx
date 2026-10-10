export default function StepIndicator({ steps, current }) {
  return (
    <ol className="steps" aria-label="Progress">
      {steps.map((label, i) => (
        <li key={label} aria-current={i === current ? 'step' : undefined} className={i < current ? 'is-done' : ''}>
          <span className="steps__n">{i + 1}</span> {label}
        </li>
      ))}
    </ol>
  );
}
