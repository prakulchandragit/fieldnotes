import { EmptyState, ErrorState, AnalysisProgress } from '../components/StateViews.jsx';
import ResultView from '../components/ResultView.jsx';
import { useIdentification } from '../hooks/useIdentification.js';

export default function Result({ draft, onSave }) {
  const ai = useIdentification(draft);
  if (!draft) return <EmptyState />;
  const editTo = `observe/${draft.category}/edit`;
  if (ai.status === 'error') return <ErrorState error={ai.error} onRetry={ai.retry} editTo={editTo} />;
  if (ai.status !== 'success') return <AnalysisProgress stage={ai.stage ?? 0} total={ai.total ?? 3} label={ai.label ?? 'Getting started'} cancelTo={`#/${editTo}`} />;
  return <ResultView draft={draft} result={ai.result} onSave={onSave} />;
}
