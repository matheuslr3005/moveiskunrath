import { useSearchParams } from "react-router";
import { Configurator } from "../features/Configurator";
import { usePageTitle } from "../lib/hooks";
import { configToParams, parseConfig, type FurnitureConfig } from "../three/config";

/** Showroom em tela cheia. A configuração vai para a URL, então o link já é o "meu móvel". */
export const ConfiguratorPage = () => {
  usePageTitle("Monte o seu em 3D");
  const [params, setParams] = useSearchParams();
  const initial = parseConfig(params) ?? undefined;

  const sync = (config: FurnitureConfig) => setParams(configToParams(config), { replace: true });

  return (
    <div className="pt-[4.5rem]">
      <Configurator initial={initial} onChange={sync} pageMode />
    </div>
  );
};
