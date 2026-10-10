import { ArrowUpRight } from 'lucide-react';
import PageHeading from '../components/PageHeading.jsx';
import Botanical from '../components/Botanical.jsx';
import { CATEGORIES } from '../data/mock.js';
import { href } from '../lib/router.js';

export default function Explore() {
  return (
    <>
      <PageHeading kicker="Explore" title="What caught your eye?">Choose a kind of thing to look for. You can always change your mind outside.</PageHeading>
      <ul className="grid-cats">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <a className="cat" href={href(`observe/${c.id}`)}>
              <Botanical name={c.art} size={84} className="cat__art" />
              <h2>{c.label}</h2>
              <p>{c.blurb}</p>
              <span className="cat__go">Observe <ArrowUpRight size={16} /></span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
