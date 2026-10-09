import { Link, useSearchParams } from "react-router";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { FavoriteButton, ProjectCard } from "../components/ProjectCard";
import { ProjectCover } from "../components/ProjectCover";
import { categories, categoryById, isCategoryId, type CategoryId } from "../data/categories";
import { projects, type Project } from "../data/projects";
import { cn } from "../lib/cn";
import { normalize, pluralize } from "../lib/text";

type View = "galeria" | "tabela";

const parseView = (value: string | null): View => (value === "tabela" ? "tabela" : "galeria");

const matchesQuery = (project: Project, query: string): boolean => {
  if (!query) return true;
  const haystack = normalize(
    [project.title, project.summary, project.style, project.materials.join(" "), categoryById[project.category].label].join(" "),
  );
  return haystack.includes(normalize(query));
};

const GalleryView = ({ items }: { items: Project[] }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    {items.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </div>
);

const TableView = ({ items }: { items: Project[] }) => (
  <div className="overflow-x-auto rounded-xl border border-line bg-elev">
    <table className="w-full min-w-[40rem] text-left text-sm">
      <thead>
        <tr className="border-b border-line text-muted">
          <th className="px-4 py-3 font-medium">Nome</th>
          <th className="px-4 py-3 font-medium">Ambiente</th>
          <th className="px-4 py-3 font-medium">Estilo</th>
          <th className="px-4 py-3 font-medium">Acabamento</th>
          <th className="w-14 px-2 py-3" />
        </tr>
      </thead>
      <tbody>
        {items.map((project) => (
          <tr key={project.slug} className="border-b border-line last:border-b-0 hover:bg-hover">
            <td className="px-4 py-2.5">
              <Link to={`/projetos/${project.slug}`} className="flex items-center gap-3 font-semibold">
                <span className="block h-10 w-14 shrink-0 overflow-hidden rounded-md border border-line">
                  <ProjectCover project={project} />
                </span>
                {project.title}
              </Link>
            </td>
            <td className="px-4 py-2.5">
              <span className="tag">{categoryById[project.category].singular}</span>
            </td>
            <td className="px-4 py-2.5 text-muted">{project.style}</td>
            <td className="px-4 py-2.5 text-muted">{project.finish}</td>
            <td className="px-2 py-2.5">
              <FavoriteButton project={project} className="size-9" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ProjectsPage = () => {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get("c");
  const category: CategoryId | null = isCategoryId(rawCategory) ? rawCategory : null;
  const query = params.get("q") ?? "";
  const view = parseView(params.get("v"));

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const items = projects.filter((project) => (!category || project.category === category) && matchesQuery(project, query));
  const activeCategory = category ? categoryById[category] : null;

  return (
    <Page
      title={activeCategory ? activeCategory.label : "Projetos"}
      emoji={activeCategory ? activeCategory.emoji : "🖼️"}
      documentTitle={activeCategory ? `Projetos · ${activeCategory.label}` : "Projetos"}
      description={
        activeCategory
          ? activeCategory.blurb
          : "Uma amostra do que a Kunrath faz. Filtre por ambiente, abra um projeto e marque os que você curtiu para levar ao orçamento."
      }
    >
      <div className="mt-8 space-y-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por ambiente">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => setParam("c", null)}>
            Todos
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              aria-pressed={category === item.id}
              onClick={() => setParam("c", category === item.id ? null : item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[14rem] flex-1">
            <span className="sr-only">Buscar projetos</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setParam("q", event.target.value || null)}
              placeholder="Buscar por nome, material, estilo…"
              className="field !pl-10"
            />
          </label>
          <div className="flex rounded-lg border border-line p-1" role="group" aria-label="Modo de visualização">
            {(
              [
                { id: "galeria", label: "Galeria", icon: "grid" },
                { id: "tabela", label: "Tabela", icon: "table" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={view === option.id}
                onClick={() => setParam("v", option.id === "galeria" ? null : option.id)}
                className={cn(
                  "inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                  view === option.id ? "bg-hover text-fg" : "text-muted hover:text-fg",
                )}
              >
                <Icon name={option.icon} className="size-4" /> {option.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted" aria-live="polite">
          {pluralize(items.length, "projeto", "projetos")}
        </p>
      </div>

      <div className="mt-4">
        {items.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-lg font-bold">Nenhum projeto encontrado</p>
            <p className="mt-1 text-muted">Tente outro termo ou limpe os filtros.</p>
            <button type="button" className="btn mt-4" onClick={() => setParams({}, { replace: true })}>
              Limpar filtros
            </button>
          </div>
        ) : view === "galeria" ? (
          <GalleryView items={items} />
        ) : (
          <TableView items={items} />
        )}
      </div>
    </Page>
  );
};
