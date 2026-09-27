import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutomaticOverviewPages from "starlight-automatic-overview-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [
        starlightAutomaticOverviewPages({
          exclude: ["guides/advanced"],
          extendIndexPages: false,
          layout: "list",
          sidebarLink: false,
        }),
      ],
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
