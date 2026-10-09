import type { ReactNode } from "react";
import { usePageTitle } from "../lib/hooks";

type PageProps = {
  title: string;
  /** Rótulo miúdo acima do título, ex.: "01 · Projetos". */
  overline: string;
  /** Título da aba do navegador; por padrão, `title`. */
  documentTitle?: string | null;
  description?: ReactNode;
  /** Imagem larga abaixo do cabeçalho (ex.: foto do projeto). */
  media?: ReactNode;
  children: ReactNode;
};

/** Esqueleto das páginas internas: cabeçalho editorial com linhas finas e conteúdo. */
export const Page = ({ title, overline, documentTitle, description, media, children }: PageProps) => {
  usePageTitle(documentTitle === undefined ? title : documentTitle);

  return (
    <article className="pop-in">
      <header className="grid-lines border-b border-line pb-14 pt-36 sm:pb-20 sm:pt-44">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-10">
          <p className="eyebrow">{overline}</p>
          <h1 className="display-xl mt-6 max-w-4xl">{title}</h1>
          {description && <p className="prose-block mt-8 max-w-xl">{description}</p>}
        </div>
      </header>
      {media && <div className="mx-auto max-w-[90rem] px-5 pt-8 sm:px-10">{media}</div>}
      <div className="mx-auto max-w-[90rem] px-5 pb-28 sm:px-10">{children}</div>
    </article>
  );
};
