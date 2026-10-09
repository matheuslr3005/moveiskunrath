import type { ReactNode } from "react";
import { usePageTitle } from "../lib/hooks";
import { cn } from "../lib/cn";

type PageProps = {
  title: string;
  emoji: string;
  /** Título da aba do navegador; por padrão, `title`. */
  documentTitle?: string | null;
  description?: ReactNode;
  cover?: ReactNode;
  children: ReactNode;
};

/** Esqueleto de página estilo Notion: capa, ícone grande, título e conteúdo. */
export const Page = ({ title, emoji, documentTitle, description, cover, children }: PageProps) => {
  usePageTitle(documentTitle === undefined ? title : documentTitle);

  return (
    <article className="pop-in">
      <div className="px-3 pt-3 sm:px-6">
        <div className={cn("h-40 overflow-hidden rounded-2xl sm:h-56", !cover && "page-cover")}>
          {cover}
        </div>
      </div>
      <div className="mx-auto max-w-[56rem] px-5 pb-24 sm:px-10">
        <div className="-mt-9 mb-4 flex size-[4.5rem] items-center justify-center rounded-2xl border border-line bg-bg text-5xl shadow-sm sm:-mt-11 sm:size-24 sm:text-6xl">
          <span aria-hidden="true">{emoji}</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="prose-block mt-4 max-w-[40rem]">{description}</p>}
        {children}
      </div>
    </article>
  );
};
