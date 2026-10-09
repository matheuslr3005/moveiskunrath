import { heroImage } from "../data/company";

/**
 * Capa da home. Com foto real (company.heroImage) usa a foto; sem ela, desenha uma
 * cozinha em penumbra com luz de LED, no clima das referências, para não ficar vazio.
 */
export const HeroScene = () => {
  if (heroImage) {
    return <img src={heroImage} alt="" className="size-full object-cover" fetchPriority="high" />;
  }

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true"
      className="size-full"
    >
      <defs>
        <linearGradient id="hero-wall" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#3b332c" />
          <stop offset="1" stopColor="#241f1a" />
        </linearGradient>
        <linearGradient id="hero-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2b241e" />
          <stop offset="1" stopColor="#120f0c" />
        </linearGradient>
        <linearGradient id="hero-splash" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f7cd48" stopOpacity="0.38" />
          <stop offset="1" stopColor="#f7cd48" stopOpacity="0" />
        </linearGradient>
        <filter id="hero-glow" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill="url(#hero-wall)" />
      <rect y="770" width="1600" height="130" fill="url(#hero-floor)" />

      {/* Coluna alta com nichos iluminados */}
      <rect x="1250" y="0" width="350" height="780" fill="#1a1612" />
      {[120, 330, 540].map((nicheY) => (
        <g key={nicheY}>
          <rect x="1285" y={nicheY} width="280" height="150" fill="#2a231c" />
          <rect x="1285" y={nicheY} width="280" height="4" fill="#f7cd48" opacity="0.95" className="led-pulse" />
          <rect x="1285" y={nicheY} width="280" height="70" fill="url(#hero-splash)" opacity="0.7" />
          <rect x="1330" y={nicheY + 92} width="52" height="58" fill="#0f0c09" />
          <rect x="1410" y={nicheY + 110} width="84" height="40" fill="#0f0c09" />
        </g>
      ))}

      {/* Armários altos */}
      <rect x="640" y="70" width="560" height="270" fill="#675c50" />
      {[1, 2, 3, 4].map((index) => (
        <rect key={index} x={640 + index * 112 - 1} y="70" width="2" height="270" fill="#1b1612" opacity="0.7" />
      ))}
      <rect x="720" y="28" width="400" height="12" fill="#0b0907" />
      <rect x="760" y="40" width="2" height="30" fill="#0b0907" />
      <rect x="1080" y="40" width="2" height="30" fill="#0b0907" />

      {/* Luz de LED sob os armários */}
      <rect x="640" y="340" width="560" height="14" fill="#f7cd48" opacity="0.7" filter="url(#hero-glow)" className="led-pulse" />
      <rect x="640" y="338" width="560" height="4" fill="#ffe28a" />
      <rect x="640" y="342" width="560" height="190" fill="url(#hero-splash)" />

      {/* Bancada, torneira e cuba */}
      <rect x="640" y="520" width="560" height="22" fill="#c9bcab" />
      <path d="M912 520v-96q0-18 22-18h16" fill="none" stroke="#0b0907" strokeWidth="9" strokeLinecap="round" />
      <rect x="640" y="542" width="560" height="228" fill="#2a241f" />
      {[1, 2, 3].map((index) => (
        <rect key={index} x={640 + index * 140 - 1} y="542" width="2" height="228" fill="#0f0c09" opacity="0.6" />
      ))}

      {/* Ilha e banquetas */}
      <rect x="560" y="610" width="700" height="26" fill="#d6c9b8" />
      <rect x="580" y="636" width="660" height="150" fill="#3a322b" />
      {[700, 910, 1120].map((stoolX) => (
        <g key={stoolX}>
          <ellipse cx={stoolX} cy="690" rx="62" ry="14" fill="#0a0806" />
          <rect x={stoolX - 5} y="700" width="10" height="130" fill="#0a0806" />
          <rect x={stoolX - 42} y="826" width="84" height="6" rx="3" fill="#0a0806" />
        </g>
      ))}
    </svg>
  );
};
