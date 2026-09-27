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
        { label: "Start", items: ["getting-started", "guides/installation"] },
        {
          label: "Guides",
          items: [
            "guides/installation",
            "guides/deployment",
            {
              label: "Advanced guides",
              items: ["guides/advanced/theming", "guides/advanced/plugins"],
            },
            "guides/next",
            { label: "External", link: "https://astro.build" },
          ],
        },
        { label: "Mixed", items: ["getting-started", "reference/api"] },
      ],
    }),
  ],
});
