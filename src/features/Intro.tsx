import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "../components/Logo";
import { forceReady, introGate, isIntroActive, markReady, readyPercent } from "../lib/intro";
import { lockScroll, unlockScroll } from "../lib/smoothScroll";

const MIN_CLOSED_MS = 1700;
const FLARE_MS = 380;
const OPEN_MS = 1900;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const loadFonts = () =>
  Promise.race([
    Promise.all([
      document.fonts.load('600 1em "Space Grotesk Variable"'),
      document.fonts.load('900 1em "Montserrat Variable"'),
      document.fonts.load('400 1em "Inter Variable"'),
    ]),
    wait(4000),
  ]);

/**
 * Entrada: o site está dentro de um armário. O progresso é real (fontes, motor 3D e primeiro quadro do hero);
 * quando fecha em 100%, a fita de LED estoura, as portas giram em 3D e a cozinha aparece.
 */
export const Intro = () => {
  const boot = useMemo(() => document.getElementById("boot"), []);
  const slot = useMemo(() => boot?.querySelector("[data-slot]") ?? null, [boot]);
  const [percent, setPercent] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!boot || !isIntroActive()) return;
    const root = document.documentElement;
    const startedAt = performance.now();
    const timers: number[] = [];
    let raf = 0;
    let minClosed = MIN_CLOSED_MS;
    let opening = false;

    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lockScroll();
    let unlocked = false;
    const release = () => {
      if (unlocked) return;
      unlocked = true;
      unlockScroll();
    };

    void loadFonts().then(() => {
      markReady("fonts");
      boot.dataset.plate = "on";
    });
    import("../three/Hero3D").then(
      () => markReady("engine"),
      () => markReady("engine"),
    );
    timers.push(window.setTimeout(forceReady, 7000), window.setTimeout(() => setCanSkip(true), 3000));

    const finish = () => {
      delete root.dataset.intro;
      release();
      setFinished(true);
    };

    const open = () => {
      boot.dataset.state = "flare";
      timers.push(
        window.setTimeout(() => {
          boot.dataset.state = "opening";
          root.dataset.intro = "open";
          timers.push(window.setTimeout(() => (introGate.opened = true), 420));
          timers.push(
            window.setTimeout(() => {
              boot.dataset.state = "done";
              timers.push(window.setTimeout(finish, 550));
            }, OPEN_MS),
          );
        }, FLARE_MS),
      );
    };

    let displayed = 0;
    const loop = () => {
      const target = readyPercent();
      const complete = target >= 100;
      // enquanto espera, o número "rasteja" um pouco à frente do que já carregou
      const goal = complete ? 100 : Math.min(target + 22, 94);
      displayed += (goal - displayed) * (complete ? 0.1 : 0.025);
      if (complete && displayed > 99.4) displayed = 100;
      boot.style.setProperty("--p", String(displayed / 100));
      setPercent(Math.round(displayed));
      if (displayed >= 100 && performance.now() - startedAt >= minClosed && !opening) {
        opening = true;
        open();
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const skip = () => {
      minClosed = 0;
      forceReady();
    };
    window.addEventListener("keydown", skip, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      release();
    };
  }, [boot]);

  if (!boot || !slot || finished) return null;

  return createPortal(
    <div className="boot-card">
      <Logo onDark className="justify-center text-3xl" />
      <div className="mt-6 flex items-baseline justify-center gap-1 font-display font-semibold tabular-nums">
        <span className="text-6xl text-accent">{String(percent).padStart(2, "0")}</span>
        <span className="text-xl text-muted">%</span>
      </div>
      <div className="boot-bar">
        <i />
      </div>
      <p className="mt-4 text-[0.6875rem] uppercase tracking-[0.3em] text-muted">Abrindo o showroom</p>
      {canSkip && (
        <button
          type="button"
          onClick={() => {
            forceReady();
          }}
          className="mt-4 text-[0.6875rem] uppercase tracking-[0.25em] text-muted underline underline-offset-4 hover:text-fg"
        >
          Pular
        </button>
      )}
    </div>,
    slot,
  );
};
