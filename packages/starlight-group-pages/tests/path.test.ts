import { describe, expect, test } from "vitest";

import {
  getCommonPath,
  getParentPath,
  getPathAncestors,
  hrefToSlug,
  slugToHref,
} from "../libs/path";
import { createContext } from "./mocks";

describe("getCommonPath", () => {
  test("returns the longest common path", () => {
    expect(getCommonPath(["guides", "guides/advanced"])).toBe("guides");
    expect(getCommonPath(["guides/a", "guides/b"])).toBe("guides");
    expect(getCommonPath(["guides/advanced", "guides/advanced"])).toBe(
      "guides/advanced"
    );
  });

  test("returns an empty path when paths have nothing in common", () => {
    expect(getCommonPath(["guides", "reference"])).toBe("");
    expect(getCommonPath(["guides", ""])).toBe("");
    expect(getCommonPath([])).toBe("");
  });

  test("compares whole segments", () => {
    expect(getCommonPath(["guide", "guides"])).toBe("");
  });
});

describe("getParentPath", () => {
  test("returns the parent path", () => {
    expect(getParentPath("guides/advanced/theming")).toBe("guides/advanced");
    expect(getParentPath("guides")).toBe("");
    expect(getParentPath("")).toBe("");
  });
});

describe("getPathAncestors", () => {
  test("returns all ancestors except the root", () => {
    expect(getPathAncestors("a/b/c")).toEqual(["a", "a/b"]);
    expect(getPathAncestors("a")).toEqual([]);
  });
});

describe("hrefToSlug", () => {
  test("returns the slug of internal links", () => {
    const context = createContext();

    expect(hrefToSlug("/", context)).toBe("");
    expect(hrefToSlug("/guides/", context)).toBe("guides");
    expect(hrefToSlug("/guides/a", context)).toBe("guides/a");
    expect(hrefToSlug("/guides/a/?query#hash", context)).toBe("guides/a");
  });

  test("strips the base", () => {
    const context = createContext({ base: "/docs" });

    expect(hrefToSlug("/docs", context)).toBe("");
    expect(hrefToSlug("/docs/", context)).toBe("");
    expect(hrefToSlug("/docs/guides/", context)).toBe("guides");
    expect(hrefToSlug("/documentation/", context)).toBe("documentation");
  });

  test("strips HTML extensions", () => {
    const context = createContext({ format: "file" });

    expect(hrefToSlug("/index.html", context)).toBe("");
    expect(hrefToSlug("/guides.html", context)).toBe("guides");
    expect(hrefToSlug("/guides/index.html", context)).toBe("guides");
  });

  test("decodes encoded characters", () => {
    expect(hrefToSlug("/gu%C3%ADas/", createContext())).toBe("guías");
  });

  test("ignores external and relative links", () => {
    const context = createContext();

    expect(hrefToSlug("https://astro.build", context)).toBeUndefined();
    expect(hrefToSlug("//astro.build", context)).toBeUndefined();
    expect(hrefToSlug("mailto:test@example.com", context)).toBeUndefined();
    expect(hrefToSlug("guides/", context)).toBeUndefined();
  });
});

describe("slugToHref", () => {
  test("formats directory paths", () => {
    expect(slugToHref("guides", createContext())).toBe("/guides/");
    expect(slugToHref("", createContext())).toBe("/");
    expect(slugToHref("guides", createContext({ base: "/docs" }))).toBe(
      "/docs/guides/"
    );
  });

  test("respects the trailing slash option", () => {
    const context = createContext({ trailingSlash: "never" });

    expect(slugToHref("guides", context)).toBe("/guides");
    expect(slugToHref("", context)).toBe("/");
    expect(
      slugToHref("", createContext({ base: "/docs", trailingSlash: "never" }))
    ).toBe("/docs");
    expect(slugToHref("guides", createContext({ trailingSlash: "always" }))).toBe(
      "/guides/"
    );
  });

  test("formats file paths", () => {
    const context = createContext({ format: "file" });

    expect(slugToHref("guides", context)).toBe("/guides.html");
    expect(slugToHref("", context)).toBe("/index.html");
    expect(slugToHref("guides", { ...context, base: "/docs" })).toBe(
      "/docs/guides.html"
    );
  });
});
