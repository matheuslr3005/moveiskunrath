import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { ProjectCover } from "../components/ProjectCover";
import { categoryById } from "../data/categories";
import { projects } from "../data/projects";
import { usePrefersReducedMotion } from "../lib/hooks";

const norm = (angle: number): number => ((((angle + 180) % 360) + 360) % 360) - 180;

/** Carrossel 3D em anel: arraste, solte (tem inércia) ou use as setas. */
export const ProjectRing = () => {
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const count = projects.length;
  const step = 360 / count;
  const host = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const items = useRef<Array<HTMLDivElement | null>>([]);
  const angle = useRef(0);
  const velocity = useRef(0);
  const goal = useRef<number | null>(null);
  const drag = useRef({ active: false, lastX: 0, moved: 0 });
  const [front, setFront] = useState(0);
  const [cardWidth, setCardWidth] = useState(300);

  const radius = useMemo(() => cardWidth / 2 / Math.tan(Math.PI / count) + 36, [cardWidth, count]);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const measure = () => setCardWidth(Math.min(300, Math.max(190, node.clientWidth * 0.26)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      const state = drag.current;
      if (!state.active) {
        if (goal.current !== null) {
          const diff = norm(goal.current - angle.current);
          angle.current += diff * 0.12;
          if (Math.abs(diff) < 0.05) goal.current = null;
        } else if (Math.abs(velocity.current) > 0.02) {
          angle.current += velocity.current;
          velocity.current *= 0.94;
        } else if (!reducedMotion) {
          angle.current -= 0.045;
        }
      }
      if (ring.current) ring.current.style.transform = `translateZ(${-radius}px) rotateY(${angle.current}deg)`;
      items.current.forEach((node, index) => {
        if (!node) return;
        const delta = Math.abs(norm(index * step + angle.current));
        const facing = Math.max(0, Math.cos((delta * Math.PI) / 180));
        node.style.opacity = String(0.22 + 0.78 * facing ** 1.5);
      });
      const nearest = ((Math.round(-angle.current / step) % count) + count) % count;
      setFront((current) => (current === nearest ? current : nearest));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [radius, step, count, reducedMotion]);

  const rotateTo = useCallback(
    (index: number) => {
      velocity.current = 0;
      goal.current = -index * step;
    },
    [step],
  );

  const onPointerDown = (event: ReactPointerEvent) => {
    drag.current = { active: true, lastX: event.clientX, moved: 0 };
    goal.current = null;
    velocity.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent) => {
    const state = drag.current;
    if (!state.active) return;
    const dx = event.clientX - state.lastX;
    state.lastX = event.clientX;
    state.moved += Math.abs(dx);
    angle.current += dx * 0.22;
    velocity.current = dx * 0.22;
  };
  const onPointerUp = () => {
    drag.current.active = false;
  };

  const current = projects[front];

  return (
    <div>
      <div
        ref={host}
        className="relative h-[27rem] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing sm:h-[31rem]"
        style={{ perspective: "1700px", perspectiveOrigin: "50% 38%" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={ring} className="absolute left-1/2 top-12 h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {projects.map((project, index) => (
            <div
              key={project.slug}
              ref={(node) => {
                items.current[index] = node;
              }}
              className="absolute"
              style={{
                width: cardWidth,
                left: -cardWidth / 2,
                transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
                WebkitBoxReflect: "below 10px linear-gradient(transparent 62%, rgb(255 255 255 / 0.16))",
              }}
            >
              <Link
                to={`/projetos/${project.slug}`}
                draggable={false}
                onClick={(event) => {
                  event.preventDefault();
                  if (drag.current.moved > 6) return;
                  if (index === front) navigate(`/projetos/${project.slug}`);
                  else rotateTo(index);
                }}
                className="group block overflow-hidden rounded-xl border border-white/15 bg-[#1a1612] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]"
              >
                <div className="pointer-events-none aspect-[4/3]">
                  <ProjectCover project={project} />
                </div>
                <div className="p-4">
                  <p className="text-[0.625rem] uppercase tracking-[0.2em] text-muted">{categoryById[project.category].singular}</p>
                  <p className="mt-1 line-clamp-1 font-display text-lg font-semibold">{project.title}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-5">
        <button type="button" className="btn size-12 !p-0" aria-label="Projeto anterior" onClick={() => rotateTo(front - 1)}>
          <Icon name="arrow" className="size-4 rotate-180" />
        </button>
        <div className="min-w-[16rem] text-center">
          <p className="text-[0.6875rem] uppercase tracking-[0.25em] text-muted">
            {String(front + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
          <p className="mt-1 font-display text-2xl font-semibold">{current?.title}</p>
          {current && (
            <Link to={`/projetos/${current.slug}`} className="link-under mt-3">
              Abrir projeto <Icon name="arrow" className="size-3.5" />
            </Link>
          )}
        </div>
        <button type="button" className="btn size-12 !p-0" aria-label="Próximo projeto" onClick={() => rotateTo(front + 1)}>
          <Icon name="arrow" className="size-4" />
        </button>
      </div>
    </div>
  );
};
