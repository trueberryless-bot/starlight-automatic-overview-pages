import type { StarlightUserConfig } from "@astrojs/starlight/types";
import type { AstroConfig, ViteUserConfig } from "astro";

import type { StarlightGroupPagesConfig } from "./config";

const RootLocale = "root";

export function vitePluginStarlightGroupPages(
  config: StarlightGroupPagesConfig,
  starlightConfig: Pick<
    StarlightUserConfig,
    "defaultLocale" | "locales" | "pagination"
  >,
  astroConfig: Pick<AstroConfig, "base" | "build" | "trailingSlash">
): VitePlugin {
  const context = getContext(starlightConfig, astroConfig);

  const modules = {
    "virtual:starlight-group-pages/config": `export default ${JSON.stringify(config)};`,
    "virtual:starlight-group-pages/context": `export default ${JSON.stringify(context)};`,
  };

  const moduleResolutionMap = Object.fromEntries(
    (Object.keys(modules) as (keyof typeof modules)[]).map((key) => [
      resolveVirtualModuleId(key),
      key,
    ])
  );

  return {
    name: "vite-plugin-starlight-group-pages",
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
  starlightConfig: Parameters<typeof vitePluginStarlightGroupPages>[1],
  astroConfig: Parameters<typeof vitePluginStarlightGroupPages>[2]
): StarlightGroupPagesContext {
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

export interface StarlightGroupPagesContext {
  base: string;
  defaultLocale: string | undefined;
  format: AstroConfig["build"]["format"];
  hasRootLocale: boolean;
  locales: string[];
  pagination: boolean;
  trailingSlash: AstroConfig["trailingSlash"];
}

type VitePlugin = NonNullable<ViteUserConfig["plugins"]>[number];
