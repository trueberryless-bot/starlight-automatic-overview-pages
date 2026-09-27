import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightAutomaticOverviewPages from "starlight-automatic-overview-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [starlightAutomaticOverviewPages()],
    }),
  ],
});
