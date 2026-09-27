import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutomaticOverviewPages from "starlight-automatic-overview-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [starlightAutomaticOverviewPages()],
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        fr: { label: "Français", lang: "fr" },
        "zh-cn": { label: "简体中文", lang: "zh-CN" },
      },
      sidebar: [
        {
          label: "Guides",
          translations: { fr: "Guides FR" },
          items: [{ autogenerate: { directory: "guides" } }],
        },
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
