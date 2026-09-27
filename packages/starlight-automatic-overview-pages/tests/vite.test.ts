import { describe, expect, test } from "vitest";

import { getContext } from "../libs/vite";

const astroConfig = {
  base: "/",
  build: { format: "directory" },
  trailingSlash: "ignore",
} as const;

describe("getContext", () => {
  test("returns the context of monolingual sites", () => {
    expect(getContext({}, astroConfig as never)).toEqual({
      base: "",
      defaultLocale: undefined,
      format: "directory",
      hasRootLocale: false,
      locales: [],
      pagination: true,
      trailingSlash: "ignore",
    });
  });

  test("strips the trailing slash of the base", () => {
    expect(
      getContext({}, { ...astroConfig, base: "/docs/" } as never).base
    ).toBe("/docs");
  });

  test("returns the locales of multilingual sites", () => {
    expect(
      getContext(
        {
          defaultLocale: "root",
          locales: {
            root: { label: "English", lang: "en" },
            fr: { label: "Français" },
          },
        },
        astroConfig as never
      )
    ).toMatchObject({ defaultLocale: undefined, hasRootLocale: true, locales: ["fr"] });

    expect(
      getContext(
        {
          defaultLocale: "en",
          locales: { en: { label: "English" }, fr: { label: "Français" } },
        },
        astroConfig as never
      )
    ).toMatchObject({ defaultLocale: "en", hasRootLocale: false, locales: ["en", "fr"] });
  });

  test("respects the pagination option", () => {
    expect(getContext({ pagination: false }, astroConfig as never).pagination).toBe(
      false
    );
  });
});
