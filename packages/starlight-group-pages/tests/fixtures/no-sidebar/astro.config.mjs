import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightGroupPages from "starlight-group-pages";

export default defineConfig({
  integrations: [
    starlight({
      title: "Overview Pages",
      pagefind: false,
      plugins: [starlightGroupPages()],
    }),
  ],
});
