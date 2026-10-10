import { normalizeGemma } from '../src/services/ai/schema.js';
import assert from 'node:assert/strict';
const base = (o={}) => ({ photo_usable:true, group:'Tits', what_i_can_see:['black head','white cheek','yellow belly'], what_is_missing:['belly stripe width'],
  candidates:[{common_name:'Great Tit',scientific_name:'Parus major',likelihood:'probable'},{common_name:'Coal Tit',scientific_name:'Periparus ater',likelihood:'probable'}],
  uncertainty:'This is definitely a Great Tit. The cheek patch fits.', habitat:'Woods', facts:['a'], quest:{title:'Count calls',minutes:99,prompt:'Listen for calls.'}, ...o });

// 1. two "probable" can't both stand; overconfident sentence removed; minutes clamped; phone line appended
let r = normalizeGemma(base(), {category:'birds',photoSent:true});
assert.equal(r.candidates.every(c=>c.confidence===38), true); assert.equal(r.confidence,38);
assert.ok(!/definitely/i.test(r.uncertainty)); assert.ok(r.uncertainty.includes('The cheek patch fits.'));
assert.equal(r.quest.minutes,20); assert.ok(/phone/i.test(r.quest.prompt)); assert.equal(r.commonName,'Great Tit');

// 2. single probable with 3 visible features is allowed
r = normalizeGemma(base({candidates:[base().candidates[0]]}), {category:'birds',photoSent:true}); assert.equal(r.confidence,62);

// 3. no photo => never above possible
r = normalizeGemma(base({candidates:[base().candidates[0]]}), {category:'birds',photoSent:false}); assert.equal(r.confidence,38);
assert.ok(r.uncertainty.includes('No photo'));

// 4. unusable photo => unlikely, no name
r = normalizeGemma(base({photo_usable:false,candidates:[base().candidates[0]]}), {category:'birds',photoSent:true});
assert.equal(r.commonName,null); assert.equal(r.confidence,12); assert.ok(r.uncertainty.includes('not clear'));

// 5. thin evidence (<2 visible features) => name withheld; <3 => no "probable"
r = normalizeGemma(base({what_i_can_see:['yellow'],candidates:[base().candidates[0]]}), {category:'birds',photoSent:true});
assert.equal(r.commonName,null); assert.equal(r.confidence,38);

// 6. junk scientific name dropped; duplicates removed; bad likelihood => unlikely
r = normalizeGemma(base({candidates:[{common_name:'X',scientific_name:'unknown??',likelihood:'sure'},{common_name:'x',scientific_name:'A b',likelihood:'possible'}]}), {category:'plants',photoSent:true});
assert.equal(r.candidates.length,1); assert.equal(r.candidates[0].scientificName,''); assert.equal(r.confidence,12);

// 7. malformed => throws
assert.throws(()=>normalizeGemma({}, {category:'birds',photoSent:true}));
console.log('all guardrail tests passed');
