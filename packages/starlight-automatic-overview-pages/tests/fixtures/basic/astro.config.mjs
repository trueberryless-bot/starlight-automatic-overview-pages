import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutomaticOverviewPages from "starlight-automatic-overview-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [starlightAutomaticOverviewPages()],
      sidebar: [
        { label: "Start", items: ["index"] },
        { label: "Guides", items: [{ autogenerate: { directory: "guides" } }] },
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
      ],
    }),
  ],
});
