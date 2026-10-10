import { ArrowRight } from 'lucide-react';
import Botanical from '../components/Botanical.jsx';
import Button from '../components/Button.jsx';

export default function Home({ observationCount }) {
  return (
    <section className="hero">
      <div className="hero__art" aria-hidden="true">
        <Botanical name="fern" size={220} className="hero__fern" />
        <Botanical name="feather" size={110} className="hero__feather" />
      </div>
      <p className="kicker">A field journal for the curious</p>
      <h1 className="hero__title">The world is more interesting than your feed.</h1>
      <p className="lede">Put the phone mostly away. Look closely, note what you see, and let Fieldnotes help you wonder about the rest.</p>
      <div className="hero__cta">
        <Button to="explore" icon={ArrowRight}>Start exploring</Button>
        <Button to="journal" variant="ghost">Open journal</Button>
      </div>
      <dl className="hero__stats">
        <div><dt>Observations</dt><dd>{observationCount}</dd></div>
        <div><dt>Today's idea</dt><dd className="serif">Find something older than you.</dd></div>
      </dl>
    </section>
  );
}
