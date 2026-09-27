import { describe, expect, test } from "vitest";

import {
  getServedLocales,
  getSlugLocale,
  localizeSlug,
  stripSlugLocale,
} from "../libs/locale";
import { createContext } from "./mocks";

const context = createContext({ locales: ["fr", "zh-cn"] });

describe("getSlugLocale", () => {
  test("returns the locale of a slug", () => {
    expect(getSlugLocale("fr/guides", context)).toBe("fr");
    expect(getSlugLocale("zh-cn", context)).toBe("zh-cn");
    expect(getSlugLocale("guides/fr", context)).toBeUndefined();
    expect(getSlugLocale("", context)).toBeUndefined();
  });
});

describe("stripSlugLocale", () => {
  test("removes the locale from a slug", () => {
    expect(stripSlugLocale("fr/guides/a", context)).toBe("guides/a");
    expect(stripSlugLocale("fr", context)).toBe("");
    expect(stripSlugLocale("guides/a", context)).toBe("guides/a");
  });
});

describe("localizeSlug", () => {
  test("adds the locale to a slug", () => {
    expect(localizeSlug("guides", "fr")).toBe("fr/guides");
    expect(localizeSlug("", "fr")).toBe("fr");
    expect(localizeSlug("guides", undefined)).toBe("guides");
  });
});

describe("getServedLocales", () => {
  test("returns the root locale for monolingual sites", () => {
    expect(getServedLocales(createContext())).toEqual([undefined]);
  });

  test("returns all locales of multilingual sites", () => {
    expect(getServedLocales({ ...context, hasRootLocale: true })).toEqual([
      undefined,
      "fr",
      "zh-cn",
    ]);
    expect(getServedLocales(context)).toEqual(["fr", "zh-cn"]);
  });
});
