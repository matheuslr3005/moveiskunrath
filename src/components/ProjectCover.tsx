import type { ReactNode } from "react";
import type { CategoryId } from "../data/categories";
import { categoryById } from "../data/categories";
import type { Project } from "../data/projects";

type Tone = Project["tone"];

const TRIM = "rgb(0 0 0 / 0.3)";
const EDGE = "rgb(255 255 255 / 0.08)";

type SceneProps = { tone: Tone };

const Doors = ({ x, y, width, height, count }: { x: number; y: number; width: number; height: number; count: number }) => (
  <>
    {Array.from({ length: count - 1 }, (_, index) => {
      const lineX = x + (width / count) * (index + 1);
      return <line key={lineX} x1={lineX} y1={y} x2={lineX} y2={y + height} stroke={TRIM} strokeWidth="1.5" />;
    })}
  </>
);

const KitchenScene = ({ tone }: SceneProps) => (
  <g>
    <rect x="36" y="44" width="328" height="76" rx="3" fill={tone.base} stroke={EDGE} />
    <Doors x={36} y={44} width={328} height={76} count={5} />
    <rect x="150" y="122" width="100" height="8" rx="2" fill={tone.accent} opacity="0.9" />
    <rect x="36" y="130" width="328" height="34" fill={tone.accent} opacity="0.16" />
    <rect x="30" y="164" width="340" height="9" rx="2" fill={tone.accent} />
    <rect x="36" y="173" width="328" height="79" fill={tone.base} stroke={EDGE} />
    <Doors x={36} y={173} width={328} height={79} count={4} />
    {[0, 1, 2, 3].map((index) => (
      <rect key={index} x={36 + 82 * index + 26} y="182" width="30" height="3" rx="1.5" fill={tone.accent} opacity="0.85" />
    ))}
  </g>
);

const BedroomScene = ({ tone }: SceneProps) => (
  <g>
    <rect x="24" y="36" width="140" height="216" rx="3" fill={tone.base} stroke={EDGE} />
    <Doors x={24} y={36} width={140} height={216} count={3} />
    {[1, 2].map((index) => (
      <rect key={index} x={24 + (140 / 3) * index - 8} y="130" width="3" height="34" rx="1.5" fill={tone.accent} />
    ))}
    <rect x="190" y="68" width="190" height="116" rx="3" fill={tone.base} stroke={EDGE} />
    {Array.from({ length: 9 }, (_, index) => (
      <line key={index} x1={202 + index * 20.5} y1="80" x2={202 + index * 20.5} y2="172" stroke={TRIM} strokeWidth="2" />
    ))}
    <rect x="190" y="68" width="190" height="14" fill={tone.accent} opacity="0.28" />
    <rect x="190" y="68" width="190" height="3" fill={tone.accent} />
    <rect x="184" y="184" width="202" height="40" rx="5" fill="var(--cover-soft)" />
    <rect x="200" y="170" width="74" height="20" rx="9" fill="var(--cover-soft)" />
    <rect x="296" y="170" width="74" height="20" rx="9" fill="var(--cover-soft)" />
    <rect x="196" y="224" width="178" height="28" fill={tone.base} stroke={EDGE} />
  </g>
);

const BathroomScene = ({ tone }: SceneProps) => (
  <g>
    {[60, 96, 132, 168, 204].map((lineY) => (
      <line key={lineY} x1="0" y1={lineY} x2="400" y2={lineY} stroke={EDGE} />
    ))}
    <circle cx="190" cy="98" r="52" fill={tone.accent} opacity="0.14" />
    <circle cx="190" cy="98" r="52" fill="none" stroke={tone.accent} strokeWidth="3.5" />
    <rect x="92" y="158" width="196" height="9" rx="2" fill={tone.accent} />
    <ellipse cx="190" cy="156" rx="42" ry="8" fill="var(--cover-soft)" />
    <rect x="100" y="167" width="180" height="58" fill={tone.base} stroke={EDGE} />
    <line x1="100" y1="196" x2="280" y2="196" stroke={TRIM} strokeWidth="1.5" />
    <rect x="172" y="178" width="36" height="3" rx="1.5" fill={tone.accent} />
    <rect x="172" y="207" width="36" height="3" rx="1.5" fill={tone.accent} />
    <rect x="312" y="56" width="52" height="176" fill={tone.base} stroke={EDGE} />
    <line x1="312" y1="144" x2="364" y2="144" stroke={TRIM} strokeWidth="1.5" />
    <rect x="328" y="146" width="3" height="26" rx="1.5" fill={tone.accent} />
  </g>
);

const CommercialScene = ({ tone }: SceneProps) => (
  <g>
    {[0, 1, 2].map((row) => (
      <g key={row}>
        <rect x="60" y={64 + row * 40} width="280" height="5" rx="1" fill={tone.base} />
        {[0, 1, 2, 3, 4, 5].map((slot) => (
          <rect
            key={slot}
            x={72 + slot * 44}
            y={64 + row * 40 - 18 - ((slot + row) % 3) * 4}
            width="30"
            height={18 + ((slot + row) % 3) * 4}
            rx="2"
            fill={(slot + row) % 2 === 0 ? tone.accent : "var(--cover-soft)"}
            opacity={(slot + row) % 2 === 0 ? 0.6 : 1}
          />
        ))}
      </g>
    ))}
    {[120, 200, 280].map((lampX) => (
      <g key={lampX}>
        <line x1={lampX} y1="0" x2={lampX} y2="22" stroke={tone.base} strokeWidth="1.5" />
        <circle cx={lampX} cy="28" r="7" fill={tone.accent} />
      </g>
    ))}
    <rect x="62" y="178" width="276" height="10" rx="2" fill={tone.accent} />
    <rect x="70" y="188" width="260" height="64" fill={tone.base} stroke={EDGE} />
    <rect x="98" y="198" width="204" height="42" rx="2" fill="none" stroke={tone.accent} strokeWidth="1.5" opacity="0.7" />
  </g>
);

const PanelScene = ({ tone }: SceneProps) => (
  <g>
    <rect x="28" y="28" width="344" height="204" rx="3" fill={tone.base} stroke={EDGE} />
    <rect x="44" y="52" width="52" height="142" rx="2" fill="var(--cover-wall)" />
    <rect x="304" y="52" width="52" height="142" rx="2" fill="var(--cover-wall)" />
    {[84, 116, 148].map((shelfY) => (
      <g key={shelfY}>
        <line x1="44" y1={shelfY} x2="96" y2={shelfY} stroke={tone.accent} opacity="0.7" />
        <line x1="304" y1={shelfY} x2="356" y2={shelfY} stroke={tone.accent} opacity="0.7" />
      </g>
    ))}
    <rect x="108" y="58" width="184" height="108" rx="3" fill="#0b0c0e" />
    <polygon points="108,58 190,58 140,166 108,166" fill="white" opacity="0.05" />
    <rect x="104" y="52" width="192" height="3" fill={tone.accent} />
    <rect x="104" y="169" width="192" height="3" fill={tone.accent} />
    <rect x="94" y="52" width="10" height="120" fill={tone.accent} opacity="0.14" />
    <rect x="296" y="52" width="10" height="120" fill={tone.accent} opacity="0.14" />
    <rect x="92" y="190" width="216" height="24" rx="2" fill={tone.accent} opacity="0.92" />
    <rect x="92" y="216" width="216" height="6" fill="black" opacity="0.18" />
  </g>
);

const scenes: Record<CategoryId, (props: SceneProps) => ReactNode> = {
  cozinhas: KitchenScene,
  dormitorios: BedroomScene,
  banheiros: BathroomScene,
  comercial: CommercialScene,
  paineis: PanelScene,
};

type ProjectCoverProps = {
  project: Pick<Project, "title" | "category" | "tone" | "images">;
  /** Quando há várias fotos, escolhe qual mostrar. */
  imageIndex?: number;
  className?: string;
};

/** Foto do projeto; sem foto, desenha uma ilustração do ambiente na paleta do projeto. */
export const ProjectCover = ({ project, imageIndex = 0, className }: ProjectCoverProps) => {
  const photo = project.images[imageIndex];
  if (photo) {
    return (
      <img src={photo} alt={project.title} loading="lazy" className={`size-full object-cover ${className ?? ""}`} />
    );
  }

  const Scene = scenes[project.category];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Ilustração: ${categoryById[project.category].singular}, ${project.title}`}
      className={`size-full ${className ?? ""}`}
    >
      <rect width="400" height="300" fill="var(--cover-wall)" />
      <rect y="252" width="400" height="48" fill="var(--cover-floor)" />
      <Scene tone={project.tone} />
    </svg>
  );
};
