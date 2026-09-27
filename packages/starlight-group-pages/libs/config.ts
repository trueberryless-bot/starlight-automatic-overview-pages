import { z } from "astro/zod";

import { throwPluginError } from "./error";

const configSchema = z
  .object({
    /**
     * A list of glob patterns matching directories, relative to the docs content collection and without a locale, for
     * which no group page should be generated or extended, e.g. `["reference/**"]`.
     *
     * @default []
     * @see https://starlight-group-pages.netlify.app/configuration/#exclude
     */
    exclude: z.array(z.string()).default([]),
    /**
     * Whether link cards should be appended to existing index pages of directories, e.g. `guides/index.mdx`.
     *
     * @default true
     * @see https://starlight-group-pages.netlify.app/configuration/#extendindexpages
     */
    extendIndexPages: z.boolean().default(true),
    /**
     * The layout of the link cards: `grid` displays them in a responsive two-column grid, `list` stacks them.
     *
     * @default "grid"
     * @see https://starlight-group-pages.netlify.app/configuration/#layout
     */
    layout: z.enum(["grid", "list"]).default("grid"),
    /**
     * Whether a link to the group page should be added as the first item of each sidebar group.
     *
     * @default true
     * @see https://starlight-group-pages.netlify.app/configuration/#sidebarlink
     */
    sidebarLink: z.boolean().default(true),
  })
  .prefault({});

export function validateConfig(userConfig: unknown): StarlightGroupPagesConfig {
  const config = configSchema.safeParse(userConfig);

  if (!config.success) {
    throwPluginError(`Invalid starlight-group-pages configuration:

${z.prettifyError(config.error)}
`);
  }

  return config.data;
}

export type StarlightGroupPagesUserConfig = z.input<typeof configSchema>;
export type StarlightGroupPagesConfig = z.output<typeof configSchema>;
