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
          : "border-line bg-bg/70 text-fg hover:bg-bg",
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
      <Link to={`/projetos/${project.slug}`} className="card group block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden border-b border-line">
          <ProjectCover
            project={project}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="space-y-2 p-4">
          <h3 className="pr-10 text-base font-bold leading-snug">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-muted">{project.summary}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="tag">
              {category.emoji} {category.singular}
            </span>
            <span className="tag">{project.style}</span>
          </div>
        </div>
      </Link>
      <FavoriteButton project={project} className="absolute right-3 top-3" />
    </div>
  );
};
