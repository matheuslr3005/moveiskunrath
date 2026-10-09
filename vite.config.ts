import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const buildId = Date.now().toString(36);

/** Publica /version.json com o id do build: o site compara e se atualiza se estiver velho. */
const versionFile = (): Plugin => ({
  name: "version-file",
  apply: "build",
  generateBundle() {
    this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify({ id: buildId }) });
  },
});

// BASE_PATH permite publicar em subcaminho (ex.: GitHub Pages em /moveiskunrath/).
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  plugins: [react(), tailwindcss(), versionFile()],
});
