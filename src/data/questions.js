// Option `value`s are matched by the mock provider; labels are what people see.
export const QUESTIONS = {
  birds: [
    { id: 'size', short: 'size', prompt: 'How big was it?', hint: 'Compare it with a bird you know.', options: [{ value: 'small', label: 'Sparrow-sized' }, { value: 'medium', label: 'Pigeon-sized' }, { value: 'large', label: 'Crow-sized or bigger' }] },
    { id: 'colour', short: 'colour', prompt: 'Which colours stood out?', options: [{ value: 'yellow', label: 'Yellow with black markings' }, { value: 'brown', label: 'Brown or streaky' }, { value: 'dark', label: 'Dark, with paler patches' }] },
    { id: 'behaviour', short: 'behaviour', prompt: 'What was it doing?', options: [{ value: 'branches', label: 'Flitting through branches' }, { value: 'ground', label: 'Hopping on the ground' }, { value: 'soaring', label: 'Soaring overhead' }] },
  ],
  plants: [
    { id: 'arrangement', short: 'leaf arrangement', prompt: 'How are the leaves arranged?', hint: 'Look at where leaves join the stem.', options: [{ value: 'trifoliate', label: 'Three leaflets from one point' }, { value: 'opposite', label: 'In pairs, facing each other' }, { value: 'basal', label: 'A rosette at ground level' }] },
    { id: 'edge', short: 'leaf edge', prompt: 'What is the leaf edge like?', options: [{ value: 'smooth', label: 'Smooth' }, { value: 'toothed', label: 'Saw-toothed' }, { value: 'lobed', label: 'Deeply lobed' }] },
    { id: 'habitat', short: 'habitat', prompt: 'Where is it growing?', options: [{ value: 'shade', label: 'Shaded woodland or mossy bank' }, { value: 'damp', label: 'Damp ground or stream edge' }, { value: 'open', label: 'Path, lawn or open ground' }] },
  ],
  insects: [
    { id: 'body', short: 'body shape', prompt: 'What did its body look like?', hint: 'Count the wings if you can.', options: [{ value: 'wingcases', label: 'Hard, dome-shaped wing cases' }, { value: 'twowings', label: 'Two clear wings, big eyes' }, { value: 'fourwings', label: 'Four wings, narrow waist' }] },
    { id: 'pattern', short: 'pattern', prompt: 'What were its colours and pattern?', options: [{ value: 'spots', label: 'Red with black spots' }, { value: 'stripes', label: 'Orange or yellow with black bands' }, { value: 'fuzzy', label: 'Fuzzy golden-brown' }] },
    { id: 'behaviour', short: 'behaviour', prompt: 'Where and how was it moving?', options: [{ value: 'foliage', label: 'Crawling on leaves or stems' }, { value: 'hover', label: 'Hovering in the air' }, { value: 'flowers', label: 'Visiting flowers' }] },
  ],
  other: [
    { id: 'where', short: 'habitat', prompt: 'What is it growing on?', options: [{ value: 'wood', label: 'Dead wood or a log' }, { value: 'rock', label: 'Rock, wall or tiles' }, { value: 'soil', label: 'Soil or leaf litter' }] },
    { id: 'pattern', short: 'pattern', prompt: 'What does the surface look like?', options: [{ value: 'bands', label: 'Concentric colour bands' }, { value: 'patchy', label: 'Flat, crusty patches' }, { value: 'capstalk', label: 'A cap on a stalk' }] },
    { id: 'under', short: 'underside', prompt: 'What is the underside like?', hint: 'Only if you can see it without damaging anything.', options: [{ value: 'pores', label: 'Tiny pores' }, { value: 'smooth-under', label: 'Smooth' }, { value: 'gills', label: 'Thin gills' }] },
  ],
};
