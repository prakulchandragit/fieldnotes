import { AlertTriangle, RotateCw } from 'lucide-react';
import Botanical from './Botanical.jsx';
import Button from './Button.jsx';
import PageHeading from './PageHeading.jsx';

export function EmptyState() {
  return (
    <div className="state">
      <Botanical name="sprig" size={90} />
      <PageHeading kicker="Identification" title="Nothing to look at yet.">Make an observation first and your result will appear here.</PageHeading>
      <Button to="explore">Start an observation</Button>
    </div>
  );
}

export function AnalysisProgress({ stage, total, label, cancelTo }) {
  return (
    <div className="state" aria-busy="true">
      <Botanical name="fern" size={110} className="sway" />
      <h1 className="state__title">Working through your observation</h1>
      <div className="progress progress--center">
        <div className="progress__bar" role="progressbar" aria-label="Analysis progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={stage}>
          <div style={{ width: `${(stage / total) * 100}%` }} />
        </div>
        <p role="status" aria-live="polite">{label} · step {Math.min(stage + 1, total)} of {total}</p>
      </div>
      <a className="link" href={cancelTo}>Cancel and edit</a>
    </div>
  );
}

export function ErrorState({ error, onRetry, editTo }) {
  const retryable = error?.retryable !== false;
  return (
    <div className="state" role="alert">
      <AlertTriangle size={36} aria-hidden="true" />
      <h1 className="state__title">That did not work.</h1>
      <p className="lede">{error?.message || 'Something went wrong while analyzing your observation.'}</p>
      <div className="row">
        {retryable && <Button icon={RotateCw} onClick={onRetry}>Try again</Button>}
        <Button to={editTo} variant="ghost">Edit observation</Button>
      </div>
    </div>
  );
}
