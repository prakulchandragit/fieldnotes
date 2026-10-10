// Hand-drawn style line illustrations, drawn with currentColor.
const ART = {
  sprig: (<><path d="M60 150V30" /><path d="M60 120c-28 0-40-20-40-44 28 0 40 16 40 44z" /><path d="M60 90c24 0 36-16 36-38-24 0-36 14-36 38z" /><path d="M60 60c-16 0-24-12-24-26 16 0 24 10 24 26z" /><path d="M60 120c-12-14-20-28-26-44M60 90c10-10 20-22 28-38" /></>),
  feather: (<><path d="M30 148C40 90 70 40 100 14c4 38-4 80-40 118" /><path d="M30 148L84 52" /><path d="M46 112c10 0 20-4 28-12M58 86c10 0 20-6 26-14M70 62c8 0 14-4 20-10" /></>),
  beetle: (<><ellipse cx="60" cy="88" rx="30" ry="42" /><path d="M60 46v84" /><circle cx="60" cy="38" r="12" /><path d="M54 28c-8-10-14-14-20-14M66 28c8-10 14-14 20-14" /><path d="M30 76H12M30 98H10M30 118l-16 14M90 76h18M90 98h20M90 118l16 14" /></>),
  stone: (<><path d="M16 120c4-34 30-60 60-58 26 2 38 22 34 58z" /><path d="M30 120c4-18 14-30 28-34M80 120c0-10 4-18 12-24" /><path d="M10 132h100" /></>),
  fern: (<><path d="M60 150C60 90 70 40 100 10" />{[0, 1, 2, 3, 4, 5].map((i) => (<g key={i}><path d={`M${64 + i * 5} ${126 - i * 18}c-16-4-26-12-32-22`} /><path d={`M${64 + i * 5} ${126 - i * 18}c14 0 22 4 30 14`} /></g>))}</>),
};

export default function Botanical({ name = 'sprig', className = '', size = 120 }) {
  return (
    <svg className={`botanical ${className}`} width={size} height={size * 1.25} viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ART[name] || ART.sprig}
    </svg>
  );
}
