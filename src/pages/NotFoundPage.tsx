import { Link } from "react-router";
import { Page } from "../components/Page";

export const NotFoundPage = () => (
  <Page title="Página não encontrada" overline="404" description="Esse endereço não existe, ou o projeto foi movido.">
    <div className="mt-8 flex gap-3">
      <Link to="/" className="btn btn-primary">
        Voltar ao início
      </Link>
      <Link to="/projetos" className="btn">
        Ver projetos
      </Link>
    </div>
  </Page>
);
