import { useState } from "react";
import { Link } from "react-router";
import { Page } from "../components/Page";
import { Reveal } from "../components/blocks";
import { processSteps } from "../data/process";
import { cn } from "../lib/cn";

export const ProcessPage = () => {
  const [active, setActive] = useState(0);
  const step = processSteps[active];

  return (
    <Page
      title="Como funciona"
      emoji="🧭"
      description="Do primeiro papo à instalação, em seis etapas. Toque em uma etapa para ver o que acontece nela."
    >
      <Reveal className="mt-10">
        <ol className="grid gap-2 sm:grid-cols-2" aria-label="Etapas do projeto">
          {processSteps.map((item, index) => (
            <li key={item.title}>
              <button
                type="button"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "card card-hover flex w-full items-center gap-4 p-4 text-left",
                  active === index && "!border-accent",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-black transition-colors",
                    active === index ? "bg-accent text-accent-ink" : "bg-hover text-muted",
                  )}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">{item.title}</span>
                  <span className="block truncate text-sm text-muted">{item.summary}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>

      {step && (
        <div key={active} className="card pop-in mt-4 border-l-4 !border-l-accent p-6" aria-live="polite">
          <p className="text-sm font-semibold text-accent-text">
            Etapa {active + 1} de {processSteps.length}
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{step.title}</h2>
          <p className="prose-block mt-3">{step.detail}</p>
          <div className="mt-5 flex gap-3">
            <button type="button" className="btn" disabled={active === 0} onClick={() => setActive(active - 1)}>
              Anterior
            </button>
            {active < processSteps.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => setActive(active + 1)}>
                Próxima etapa
              </button>
            ) : (
              <Link to="/orcamento" className="btn btn-primary">
                Começar meu projeto
              </Link>
            )}
          </div>
        </div>
      )}
    </Page>
  );
};
