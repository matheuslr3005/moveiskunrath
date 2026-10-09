import { useId } from "react";
import { company } from "../data/company";

/** Selo circular com texto em volta, como o "A" da referência Aurelia. */
export const Seal = ({ className }: { className?: string }) => {
  const pathId = useId();
  const text = `EMPRESA FAMILIAR · ${company.yearsInMarket} ANOS DE MERCADO · SOB MEDIDA · `;

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`Empresa familiar, ${company.yearsInMarket} anos de mercado`}>
      <defs>
        <path id={pathId} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <g className="spin-slow" style={{ transformOrigin: "60px 60px" }}>
        <text fontSize="8" letterSpacing="2.2" fill="currentColor" fontFamily="var(--font-sans)">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </g>
      <text x="60" y="73" textAnchor="middle" fontSize="38" fill="var(--accent)" fontFamily="var(--font-display)" fontWeight="500">
        K
      </text>
    </svg>
  );
};
