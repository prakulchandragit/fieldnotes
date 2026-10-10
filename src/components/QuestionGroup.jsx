export default function QuestionGroup({ question, value, onChange }) {
  const options = [...question.options, { value: '', label: 'Not sure' }];
  return (
    <fieldset className="question">
      <legend>{question.prompt}</legend>
      {question.hint && <p className="question__hint">{question.hint}</p>}
      <div className="choices">
        {options.map((o) => (
          <label key={o.value || 'none'} className={`choice ${(value ?? '') === o.value ? 'is-on' : ''}`}>
            <input type="radio" name={question.id} value={o.value} checked={(value ?? '') === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
