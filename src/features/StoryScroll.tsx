import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { HeroScene } from "../components/HeroScene";
import { cn } from "../lib/cn";
import { findFinish } from "../three/finishData";
import { finishIndexAt, STEP_COUNT, storyFinishes } from "../three/story";

const StoryScene = lazy(() => import("../three/StoryScene").then((module) => ({ default: module.StoryScene })));

const chapters = [
  { label: "Conversa", title: "Você sonha. A gente escuta.", text: "Tudo começa com um papo: como você vive, o que precisa guardar e qual estilo é a sua cara." },
  { label: "Medição", title: "Medido de perto, milímetro a milímetro.", text: "Conferimos paredes, pontos de luz e água para o móvel encaixar exatamente onde foi pensado." },
  { label: "Projeto", title: "O móvel vira desenho, peça por peça.", text: "Cada painel, prateleira e porta é projetado antes de existir, e você acompanha tudo." },
  { label: "Aprovação", title: "Escolha o acabamento. Ajuste até ficar perfeito.", text: "Cores, madeiras e puxadores testados no projeto. Só avançamos com o seu ok." },
  { label: "Produção", title: "As peças ganham forma e se encaixam.", text: "O projeto aprovado sai do papel: cada peça é cortada, conferida e montada." },
  { label: "Instalação", title: "No lugar certo, com a luz acesa.", text: "A equipe monta e ajusta tudo no local. É só abrir as portas e usar." },
];

type Hud = { step: number; finish: number };

export const StoryScroll = () => {
  const outer = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [hud, setHud] = useState<Hud>({ step: 0, finish: 0 });

  useEffect(() => {
    const update = () => {
      const node = outer.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const value = Math.min(1, Math.max(0, -rect.top / total));
      progress.current = value;
      const t = value * STEP_COUNT;
      const step = Math.min(STEP_COUNT - 1, Math.floor(t));
      const finish = finishIndexAt(t);
      setHud((current) => (current.step === step && current.finish === finish ? current : { step, finish }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const goToStep = (index: number) => {
    const node = outer.current;
    if (!node) return;
    const total = node.offsetHeight - window.innerHeight;
    window.scrollTo({ top: node.offsetTop + ((index + 0.5) / STEP_COUNT) * total, behavior: "smooth" });
  };

  const chapter = chapters[hud.step] ?? chapters[0]!;

  return (
    <div ref={outer} className="relative h-[620svh]" aria-label="Do sonho ao móvel, em seis etapas">
      <div className="sticky top-0 h-svh overflow-hidden">
        <Suspense fallback={<HeroScene />}>
          <StoryScene progress={progress} className="absolute inset-0" />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 top-24 mx-auto max-w-[90rem] px-5 sm:px-10">
          <p className="eyebrow">Do sonho ao móvel</p>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[90rem] items-end justify-between gap-6 px-5 pb-10 sm:px-10 sm:pb-14">
          <div key={hud.step} className="hud pop-in pointer-events-auto w-full max-w-md rounded-2xl p-6 sm:p-7">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-6xl font-semibold tabular-nums text-accent">0{hud.step + 1}</span>
              <span className="text-[0.6875rem] uppercase tracking-[0.25em] text-muted">{chapter.label}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{chapter.title}</h3>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted">{chapter.text}</p>
            {hud.step === 3 && (
              <div className="mt-5 flex items-center gap-3" aria-label="Acabamentos">
                {storyFinishes.map((id, index) => (
                  <span
                    key={id}
                    title={findFinish(id).label}
                    className={cn(
                      "size-8 rounded-full border border-white/25 transition-transform duration-300",
                      hud.finish === index && "scale-125 ring-2 ring-accent ring-offset-2 ring-offset-[#15120f]",
                    )}
                    style={{ background: findFinish(id).color }}
                  />
                ))}
                <span className="ml-1 text-xs uppercase tracking-[0.18em] text-muted">{findFinish(storyFinishes[hud.finish] ?? "carvalho").label}</span>
              </div>
            )}
          </div>

          <ol className="pointer-events-auto hidden flex-col gap-3 pb-1 sm:flex" aria-label="Etapas">
            {chapters.map((item, index) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  aria-label={`Ir para ${item.label}`}
                  aria-current={hud.step === index}
                  className="group flex items-center gap-3"
                >
                  <span className={cn("text-[0.6875rem] uppercase tracking-[0.2em] transition-opacity", hud.step === index ? "opacity-100" : "opacity-0 group-hover:opacity-70")}>
                    {item.label}
                  </span>
                  <span className={cn("block h-[3px] rounded-full transition-all duration-500", hud.step === index ? "w-10 bg-accent" : "w-4 bg-white/30")} />
                </button>
              </li>
            ))}
          </ol>
        </div>

        {hud.step === 0 && (
          <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[0.6875rem] uppercase tracking-[0.3em] text-muted sm:block">
            Role para avançar
          </div>
        )}
      </div>
    </div>
  );
};
