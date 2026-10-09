import { Link } from "react-router";
import { categoryById } from "../data/categories";
import type { Project } from "../data/projects";
import { cn } from "../lib/cn";
import { useFavorites } from "../lib/favorites";
import { Icon } from "./Icon";
import { ProjectCover } from "./ProjectCover";

export const FavoriteButton = ({ project, className }: { project: Project; className?: string }) => {
  const favorites = useFavorites();
  const active = favorites.has(project.slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remover ${project.title} do orçamento` : `Adicionar ${project.title} ao orçamento`}
      title={active ? "Remover do orçamento" : "Adicionar ao orçamento"}
      onClick={() => favorites.toggle(project.slug)}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border backdrop-blur transition-[transform,background-color,color] active:scale-90",
        active
          ? "border-transparent bg-accent text-accent-ink"
          : "border-white/25 bg-black/35 text-white hover:bg-black/55",
        className,
      )}
    >
      <Icon name="heart" filled={active} className="size-5" />
    </button>
  );
};

export const ProjectCard = ({ project }: { project: Project }) => {
  const category = categoryById[project.category];

  return (
    <div className="relative">
      <Link to={`/projetos/${project.slug}`} className="group block">
        <div className="aspect-[4/3] overflow-hidden rounded-md border border-line">
          <ProjectCover
            project={project}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
        </div>
        <p className="eyebrow mt-5 !gap-0 before:hidden">
          {category.singular} · {project.style}
        </p>
        <h3 className="mt-2 pr-10 font-display text-3xl font-light leading-[1.05] transition-colors group-hover:text-accent-text">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 max-w-md text-sm font-light text-muted">{project.summary}</p>
      </Link>
      <FavoriteButton project={project} className="absolute right-3 top-3" />
    </div>
  );
};
