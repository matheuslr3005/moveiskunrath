import { Route, Routes } from "react-router";
import { FavoritesProvider } from "../lib/favorites";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProcessPage } from "../pages/ProcessPage";
import { ProjectDetailPage } from "../pages/ProjectDetailPage";
import { ProjectsPage } from "../pages/ProjectsPage";
import { QuotePage } from "../pages/QuotePage";
import { Layout } from "./Layout";

export const App = () => (
  <FavoritesProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projetos" element={<ProjectsPage />} />
        <Route path="projetos/:slug" element={<ProjectDetailPage />} />
        <Route path="sobre" element={<AboutPage />} />
        <Route path="como-funciona" element={<ProcessPage />} />
        <Route path="orcamento" element={<QuotePage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </FavoritesProvider>
);
