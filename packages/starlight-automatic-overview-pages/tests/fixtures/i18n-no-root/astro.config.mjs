import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutomaticOverviewPages from "starlight-automatic-overview-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [starlightAutomaticOverviewPages()],
      defaultLocale: "en",
      locales: {
        en: { label: "English", lang: "en" },
        fr: { label: "Français", lang: "fr" },
      },
      sidebar: [
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
      ],
    }),
  ],
});
