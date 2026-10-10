import { BookOpen, Compass, Home, Target } from 'lucide-react';
import { href } from '../lib/router.js';
import Botanical from './Botanical.jsx';

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'quests', label: 'Quests', icon: Target },
];
// Which nav item stays highlighted on the sub-screens.
const PARENT = { observe: 'explore', result: 'explore' };

export default function Layout({ route, children }) {
  const active = PARENT[route] || route;
  return (
    <div className="shell">
      <header className="topbar">
        <a href={href('')} className="wordmark"><Botanical name="sprig" size={22} /> Fieldnotes</a>
        <nav className="topnav" aria-label="Primary">
          {NAV.slice(1).map(({ id, label }) => (
            <a key={id} href={href(id)} aria-current={active === id ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
      </header>
      <main className="page" key={route}>{children}</main>
      <nav className="tabbar" aria-label="Primary">
        {NAV.map(({ id, label, icon: Icon }) => (
          <a key={id} href={href(id === 'home' ? '' : id)} aria-current={active === id ? 'page' : undefined}>
            <Icon size={20} aria-hidden="true" /><span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
