import { href } from '../lib/router.js';

// Renders a link when `to` is given, otherwise a button.
export default function Button({ to, variant = 'primary', icon: Icon, children, ...rest }) {
  const cls = `btn btn--${variant}`;
  const inner = (<><span>{children}</span>{Icon && <Icon size={18} aria-hidden="true" />}</>);
  return to ? <a className={cls} href={href(to)} {...rest}>{inner}</a> : <button type="button" className={cls} {...rest}>{inner}</button>;
}
