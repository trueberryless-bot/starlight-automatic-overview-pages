/// <reference path="./locals.d.ts" />
import type { StarlightPlugin } from "@astrojs/starlight/types";

import {
  type StarlightAutomaticOverviewPagesConfig,
  type StarlightAutomaticOverviewPagesUserConfig,
  validateConfig,
} from "./libs/config";
import { getComponentOverrides } from "./libs/starlight";
import { vitePluginStarlightAutomaticOverviewPages } from "./libs/vite";
import { Translations } from "./translations";

export type {
  StarlightAutomaticOverviewPagesConfig,
  StarlightAutomaticOverviewPagesUserConfig,
};

export default function starlightAutomaticOverviewPages(
  userConfig?: StarlightAutomaticOverviewPagesUserConfig
): StarlightPlugin {
  const config = validateConfig(userConfig);

  return {
    name: "starlight-automatic-overview-pages",
    hooks: {
      "i18n:setup"({ injectTranslations }) {
        injectTranslations(Translations);
      },
      "config:setup"({
        addIntegration,
        addRouteMiddleware,
        config: starlightConfig,
        logger,
        updateConfig: updateStarlightConfig,
      }) {
        addRouteMiddleware({
          entrypoint: "starlight-automatic-overview-pages/middleware",
        });

        updateStarlightConfig({
          components: getComponentOverrides(
            starlightConfig.components,
            logger,
            ["MarkdownContent"]
          ),
        });

        addIntegration({
          name: "starlight-automatic-overview-pages-integration",
          hooks: {
            "astro:config:setup": ({
              config: astroConfig,
              injectRoute,
              updateConfig,
            }) => {
              updateConfig({
                vite: {
                  plugins: [
                    vitePluginStarlightAutomaticOverviewPages(
                      config,
                      starlightConfig,
                      astroConfig
                    ),
                  ],
                },
              });

              injectRoute({
                entrypoint:
                  "starlight-automatic-overview-pages/routes/Overview.astro",
                pattern: "[...overview]",
                prerender: true,
              });
            },
          },
        });
      },
    },
  };
}
