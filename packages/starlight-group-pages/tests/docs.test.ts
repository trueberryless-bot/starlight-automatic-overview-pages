import { describe, expect, test } from "vitest";

import { findDocsPage, getLocaleDirectories } from "../libs/docs";
import { createContext, createDocs, createEntry } from "./mocks";

describe("createDocsIndex", () => {
  test("collects the directories containing pages", () => {
    const docs = createDocs([
      createEntry("index"),
      createEntry("guides"),
      createEntry("guides/a"),
      createEntry("guides/advanced/b"),
      createEntry("reference"),
    ]);

    expect([...getLocaleDirectories(docs, undefined)]).toEqual([
      "guides",
      "guides/advanced",
    ]);
  });

  test("ignores hidden pages when collecting directories", () => {
    const docs = createDocs([
      createEntry("secret/a", { sidebar: { hidden: true } }),
    ]);

    expect(getLocaleDirectories(docs, undefined).size).toBe(0);
  });

  test("collects directories per locale including fallback pages", () => {
    const context = createContext({
      defaultLocale: "en",
      locales: ["en", "fr"],
    });
    const docs = createDocs(
      [createEntry("en/guides/a"), createEntry("fr/extra/b")],
      context
    );

    expect([...getLocaleDirectories(docs, "en")]).toEqual(["guides"]);
    expect([...getLocaleDirectories(docs, "fr")]).toEqual(["guides", "extra"]);
  });

  test("uses the sidebar label and falls back to the title", () => {
    const docs = createDocs([
      createEntry("a", { title: "A title", sidebar: { label: "A label" } }),
      createEntry("b", { title: "B title" }),
    ]);

    expect(docs.pages.get("a")?.label).toBe("A label");
    expect(docs.pages.get("b")?.label).toBe("B title");
  });
});

describe("findDocsPage", () => {
  test("falls back to the default locale", () => {
    const context = createContext({
      defaultLocale: "en",
      locales: ["en", "fr"],
    });
    const docs = createDocs(
      [
        createEntry("en/guides", { title: "Guides" }),
        createEntry("fr/reference", { title: "Référence" }),
      ],
      context
    );

    expect(findDocsPage(docs, "guides", "fr", context)?.id).toBe("en/guides");
    expect(findDocsPage(docs, "reference", "fr", context)?.id).toBe(
      "fr/reference"
    );
    expect(findDocsPage(docs, "reference", "en", context)).toBeUndefined();
  });
});
