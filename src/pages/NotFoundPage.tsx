import { Link } from "react-router";
import { Page } from "../components/Page";

export const NotFoundPage = () => (
  <Page title="Página não encontrada" emoji="🔍" description="Esse endereço não existe, ou o projeto foi movido.">
    <div className="mt-8 flex gap-3">
      <Link to="/" className="btn btn-primary min-h-11 px-5">
        Voltar ao início
      </Link>
      <Link to="/projetos" className="btn min-h-11 px-5">
        Ver projetos
      </Link>
    </div>
  </Page>
);
