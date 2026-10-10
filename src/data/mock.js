export const CATEGORIES = [
  { id: 'birds', label: 'Birds', blurb: 'Listen first. Then look up.', art: 'feather' },
  { id: 'plants', label: 'Plants', blurb: 'Leaves, bark, and what grows where.', art: 'sprig' },
  { id: 'insects', label: 'Insects', blurb: 'Small lives, close attention.', art: 'beetle' },
  { id: 'other', label: 'Everything else', blurb: 'Fungi, stones, tracks, clouds, sky.', art: 'stone' },
];

export const SEED_ENTRIES = [
  { id: 's1', seed: true, date: '2026-09-28', category: 'birds', place: 'Orchard edge', description: 'Small bird working the apple branches, upside down at times. Yellow underneath.', match: 'Great Tit', confidence: 62 },
  { id: 's2', seed: true, date: '2026-09-21', category: 'plants', place: 'Deodar wood', description: 'Clover-like leaves folded shut in the late afternoon. Smelled of damp moss.', match: 'Wood Sorrel', confidence: 58 },
  { id: 's3', seed: true, date: '2026-09-14', category: 'insects', place: 'Garden wall', description: 'Orange-red beetle sunning on a warm stone. Left when my shadow crossed it.', match: 'Seven-spot Ladybird', confidence: 66 },
];

export const QUESTS = [
  { id: 'q1', title: 'Three greens', minutes: 10, category: 'plants', prompt: 'Find three different greens within 20 steps. Name what makes each one different.' },
  { id: 'q2', title: 'Sit-spot silence', minutes: 15, category: 'birds', prompt: 'Sit still and count how many distinct bird sounds you hear. Do not look — just listen.' },
  { id: 'q3', title: 'Under the stone', minutes: 10, category: 'insects', prompt: 'Gently lift a stone or log. Count the legs of the first creature you see, then put it back.' },
  { id: 'q4', title: 'Bark rubbing, by eye', minutes: 10, category: 'plants', prompt: 'Find two trees with very different bark. Describe each as you would to someone blind.' },
  { id: 'q5', title: 'Cloud shape study', minutes: 5, category: 'other', prompt: 'Look up. Decide what kind of clouds you see and what they suggest about the next hour.' },
];

export const todayLabel = (iso) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
