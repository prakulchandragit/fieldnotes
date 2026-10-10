import { useEffect, useState } from 'react';

const parse = () => {
  const [name = '', param, extra] = window.location.hash.replace(/^#\/?/, '').split('/');
  return { name: name || 'home', param, extra };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => { setRoute(parse()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const href = (path) => `#/${path}`;
export const go = (path) => { window.location.hash = `/${path}`; };
