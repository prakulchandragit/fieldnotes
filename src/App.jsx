import { useState } from 'react';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import Observe from './pages/Observe.jsx';
import Result from './pages/Result.jsx';
import Journal from './pages/Journal.jsx';
import Quests from './pages/Quests.jsx';
import GoLook from './pages/GoLook.jsx';
import { SEED_ENTRIES } from './data/mock.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useRoute, go } from './lib/router.js';

export default function App() {
  const { name, param, extra } = useRoute();
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useLocalStorage('fieldnotes.observations', []);
  const [done, setDone] = useLocalStorage('fieldnotes.quests', []);
  const entries = [...saved, ...SEED_ENTRIES];

  const saveEntry = (result) => {
    const { uncertainty, features, habitat, facts, followUp, scientificName, quest } = result;
    const entry = {
      id: `u${Date.now()}`, date: new Date().toISOString().slice(0, 10), category: draft.category,
      photo: draft.photo, place: draft.place, description: draft.description, answers: draft.answers,
      match: result.commonName || `${result.categoryLabel}, not yet identified`, confidence: result.confidence,
      mock: result.meta.isMock, analyzedBy: result.meta.isMock ? null : result.meta.model, photoAnalyzed: result.meta.imageAnalyzed,
      result: { scientificName, uncertainty, features, habitat, facts, followUp, quest },
    };
    setSaved([entry, ...saved]);
    setDraft(null);
    go(`look/${entry.id}`);
  };
  const addNote = (id, fieldNote) => setSaved(saved.map((e) => (e.id === id ? { ...e, fieldNote } : e)));
  const toggleQuest = (id) => setDone(done.includes(id) ? done.filter((x) => x !== id) : [...done, id]);

  const pages = {
    home: <Home observationCount={saved.length} />,
    explore: <Explore />,
    observe: <Observe key={`${param}/${extra}`} category={param} prefill={extra === 'edit' ? draft : null} onSubmit={setDraft} />,
    result: <Result draft={draft} onSave={saveEntry} />,
    journal: <Journal entries={entries} onDelete={(id) => setSaved(saved.filter((e) => e.id !== id))} />,
    quests: <Quests done={done} onToggle={toggleQuest} />,
  };
  // The go-and-look screen is deliberately full-screen with no navigation, to nudge people to put the phone away.
  if (name === 'look') return <GoLook entry={saved.find((e) => e.id === param)} onNote={addNote} />;
  return <Layout route={pages[name] ? name : 'home'}>{pages[name] || pages.home}</Layout>;
}
