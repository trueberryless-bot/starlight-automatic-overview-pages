import type { StarlightUserConfig } from "@astrojs/starlight/types";
import type { AstroConfig, ViteUserConfig } from "astro";

import type { StarlightAutomaticOverviewPagesConfig } from "./config";

const RootLocale = "root";

export function vitePluginStarlightAutomaticOverviewPages(
  config: StarlightAutomaticOverviewPagesConfig,
  starlightConfig: Pick<
    StarlightUserConfig,
    "defaultLocale" | "locales" | "pagination"
  >,
  astroConfig: Pick<AstroConfig, "base" | "build" | "trailingSlash">
): VitePlugin {
  const context = getContext(starlightConfig, astroConfig);

  const modules = {
    "virtual:starlight-automatic-overview-pages/config": `export default ${JSON.stringify(config)};`,
    "virtual:starlight-automatic-overview-pages/context": `export default ${JSON.stringify(context)};`,
  };

  const moduleResolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: "vite-plugin-starlight-automatic-overview-pages",
    load(id) {
      const moduleId = moduleResolutionMap[id];
      return moduleId ? modules[moduleId] : undefined;
    },
    resolveId(id) {
      return Object.hasOwn(modules, id)
        ? resolveVirtualModuleId(id)
        : undefined;
    },
  };
}

export function getContext(
  starlightConfig: Parameters<
    typeof vitePluginStarlightAutomaticOverviewPages
  >[1],
  astroConfig: Parameters<typeof vitePluginStarlightAutomaticOverviewPages>[2]
): StarlightAutomaticOverviewPagesContext {
  const localeKeys = Object.keys(starlightConfig.locales ?? {});
  const locales = localeKeys.filter((locale) => locale !== RootLocale);

  return {
    base: stripTrailingSlash(astroConfig.base),
    defaultLocale: getDefaultLocale(starlightConfig.defaultLocale, locales),
    format: astroConfig.build.format,
    hasRootLocale: localeKeys.includes(RootLocale),
    locales,
    pagination: starlightConfig.pagination ?? true,
    trailingSlash: astroConfig.trailingSlash,
  };
}

function getDefaultLocale(
  defaultLocale: string | undefined,
  locales: string[]
): string | undefined {
  return defaultLocale && locales.includes(defaultLocale)
    ? defaultLocale
    : undefined;
}

function stripTrailingSlash(path: string): string {
  return path.replace(/\/+$/, "");
}

function resolveVirtualModuleId<TModuleId extends string>(
  id: TModuleId
): `\0${TModuleId}` {
  return `\0${id}`;
}

export interface StarlightAutomaticOverviewPagesContext {
  base: string;
  defaultLocale: string | undefined;
  format: AstroConfig["build"]["format"];
  hasRootLocale: boolean;
  locales: string[];
  pagination: boolean;
  trailingSlash: AstroConfig["trailingSlash"];
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
