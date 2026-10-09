import { useState } from "react";
import { Link } from "react-router";
import { Page } from "../components/Page";
import { processSteps } from "../data/process";
import { cn } from "../lib/cn";

export const ProcessPage = () => {
  const [active, setActive] = useState(0);
  const step = processSteps[active];

  return (
    <Page
      title="Como funciona"
      overline="03 · Processo"
      description="Do primeiro papo à instalação, em seis etapas. Toque em uma etapa para ver o que acontece nela."
    >
      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <ol className="border-t border-line" aria-label="Etapas do projeto">
          {processSteps.map((item, index) => (
            <li key={item.title} className="border-b border-line">
              <button
                type="button"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "group flex w-full items-baseline gap-5 py-5 text-left transition-colors",
                  active === index ? "text-accent-text" : "text-muted hover:text-fg",
                )}
              >
                <span className="w-8 text-[0.6875rem] tracking-[0.2em]">0{index + 1}</span>
                <span className={cn("font-display text-3xl font-light transition-transform duration-500 sm:text-4xl", active === index && "translate-x-2")}>
                  {item.title}
                </span>
              </button>
            </li>
          ))}
        </ol>

        {step && (
          <div key={active} className="pop-in border-line lg:sticky lg:top-28 lg:self-start lg:border-l lg:pl-14" aria-live="polite">
            <p className="eyebrow">
              Etapa {active + 1} de {processSteps.length}
            </p>
            <h2 className="display-lg mt-6">{step.summary}</h2>
            <p className="prose-block mt-6 max-w-md">{step.detail}</p>
            <div className="mt-10 flex gap-3">
              <button type="button" className="btn" disabled={active === 0} onClick={() => setActive(active - 1)}>
                Anterior
              </button>
              {active < processSteps.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={() => setActive(active + 1)}>
                  Próxima
                </button>
              ) : (
                <Link to="/orcamento" className="btn btn-primary">
                  Começar meu projeto
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};
