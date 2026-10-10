export default function PageHeading({ kicker, title, children }) {
  return (
    <div className="heading">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1>{title}</h1>
      {children && <p className="lede">{children}</p>}
    </div>
  );
}
