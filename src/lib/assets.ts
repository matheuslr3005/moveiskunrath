/** Prefixa caminhos de /public com a base do site (necessário ao publicar em subcaminho). */
export const assetUrl = (path: string): string => `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
