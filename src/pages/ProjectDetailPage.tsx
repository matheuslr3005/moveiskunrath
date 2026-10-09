import { Link, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { FavoriteButton, ProjectCard } from "../components/ProjectCard";
import { ProjectCover } from "../components/ProjectCover";
import { Callout, PropertyTable, Section } from "../components/blocks";
import { categoryById } from "../data/categories";
import { findProject, projects } from "../data/projects";
import { useCopyToClipboard } from "../lib/hooks";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import { NotFoundPage } from "./NotFoundPage";

export const ProjectDetailPage = () => {
  const { slug } = useParams();
  const project = findProject(slug);
  const { copied, copy } = useCopyToClipboard();

  if (!project) return <NotFoundPage />;

  const category = categoryById[project.category];
  const related = projects.filter((item) => item.category === project.category && item.slug !== project.slug).slice(0, 2);
  const hasPhotos = project.images.length > 0;
  const askMessage = `Olá, Móveis Kunrath! Gostei do projeto "${project.title}" (${window.location.href}) e queria um orçamento parecido.`;

  return (
    <Page
      title={project.title}
      emoji={category.emoji}
      cover={<ProjectCover project={project} />}
      description={project.summary}
    >
      <nav aria-label="Trilha" className="mt-6 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link to="/projetos" className="hover:text-fg">
          Projetos
        </Link>
        <Icon name="chevron" className="size-3.5" />
        <Link to={`/projetos?c=${category.id}`} className="hover:text-fg">
          {category.label}
        </Link>
      </nav>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={`/orcamento?ref=${project.slug}`} className="btn btn-primary min-h-11 px-5">
          Pedir orçamento parecido
        </Link>
        <a href={buildWhatsAppUrl(askMessage)} target="_blank" rel="noreferrer" className="btn min-h-11 px-4">
          <Icon name="whatsapp" className="size-4" /> WhatsApp
        </a>
        <button type="button" className="btn min-h-11 px-4" onClick={() => copy(window.location.href)}>
          <Icon name={copied ? "check" : "link"} className="size-4" /> {copied ? "Link copiado" : "Copiar link"}
        </button>
        <FavoriteButton project={project} className="size-11" />
      </div>

      <div className="mt-10">
        <PropertyTable
          items={[
            { label: "Ambiente", value: <span className="tag">{category.emoji} {category.singular}</span> },
            { label: "Estilo", value: project.style },
            { label: "Acabamento", value: project.finish },
            {
              label: "Materiais",
              value: (
                <span className="flex flex-wrap gap-1.5">
                  {project.materials.map((material) => (
                    <span key={material} className="tag">
                      {material}
                    </span>
                  ))}
                </span>
              ),
            },
            {
              label: "Cores",
              value: (
                <span className="flex items-center gap-2">
                  {[project.tone.base, project.tone.accent].map((color) => (
                    <span key={color} className="size-5 rounded-full border border-line" style={{ background: color }} title={color} />
                  ))}
                </span>
              ),
            },
          ]}
        />
      </div>

      <section className="mt-10">
        <p className="prose-block">{project.description}</p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-3">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="card flex items-center gap-2.5 px-4 py-3 text-sm font-medium">
              <Icon name="check" className="size-4 shrink-0 text-accent-text" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      {hasPhotos && project.images.length > 1 && (
        <Section title="Fotos" emoji="📷">
          <div className="grid gap-3 sm:grid-cols-2">
            {project.images.map((image, index) => (
              <div key={image} className="aspect-[4/3] overflow-hidden rounded-xl border border-line">
                <ProjectCover project={project} imageIndex={index} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {!hasPhotos && (
        <Callout emoji="🖼️" className="mt-10">
          <p>Ilustração de exemplo. As fotos reais deste projeto entram aqui assim que forem adicionadas.</p>
        </Callout>
      )}

      {related.length > 0 && (
        <Section title={`Mais em ${category.label}`} emoji={category.emoji}>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </Section>
      )}
    </Page>
  );
};
