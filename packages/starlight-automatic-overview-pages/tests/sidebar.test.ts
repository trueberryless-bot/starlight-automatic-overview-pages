import { describe, expect, test } from "vitest";

import { getSidebarOverviews, insertOverviewLinks } from "../libs/sidebar";
import {
  createConfig,
  createContext,
  createDocs,
  createEntry,
  createGroup,
  createLink,
} from "./mocks";

const docs = createDocs([
  createEntry("index"),
  createEntry("getting-started"),
  createEntry("guides/a"),
  createEntry("guides/b"),
  createEntry("guides/advanced/c"),
  createEntry("reference", { title: "Reference" }),
  createEntry("reference/api"),
  createEntry("secret", { sidebar: { hidden: true } }),
  createEntry("secret/d"),
]);

const options = {
  config: createConfig(),
  context: createContext(),
  docs,
  locale: undefined,
};

describe("getSidebarOverviews", () => {
  test("maps groups to the common directory of their links", () => {
    const advanced = createGroup("Advanced", [
      createLink("/guides/advanced/c/"),
    ]);
    const guides = createGroup("Guides", [
      createLink("/guides/a/"),
      createLink("/guides/b/"),
      advanced,
    ]);

    expect(getSidebarOverviews([guides], options)).toEqual([
      { directory: "guides", group: guides, href: "/guides/", slug: "guides" },
      {
        directory: "guides/advanced",
        group: advanced,
        href: "/guides/advanced/",
        slug: "guides/advanced",
      },
    ]);
  });

  test("treats links to index pages as part of their directory", () => {
    const reference = createGroup("Reference", [
      createLink("/reference/"),
      createLink("/reference/api/"),
    ]);

    expect(getSidebarOverviews([reference], options)[0]?.directory).toBe(
      "reference"
    );
  });

  test("ignores groups spanning multiple directories", () => {
    const group = createGroup("Start", [
      createLink("/getting-started/"),
      createLink("/guides/a/"),
    ]);

    expect(getSidebarOverviews([group], options)).toEqual([]);
  });

  test("ignores external links and groups without internal links", () => {
    const withExternal = createGroup("Guides", [
      createLink("/guides/a/"),
      createLink("https://astro.build"),
    ]);
    const externalOnly = createGroup("Links", [
      createLink("https://astro.build"),
    ]);

    expect(
      getSidebarOverviews([withExternal, externalOnly], options).map(
        ({ group }) => group.label
      )
    ).toEqual(["Guides"]);
  });

  test("assigns a directory to the first matching group only", () => {
    const inner = createGroup("Inner", [createLink("/guides/a/")]);
    const outer = createGroup("Outer", [inner]);

    expect(getSidebarOverviews([outer], options).map(({ group }) => group)).toEqual(
      [outer]
    );
  });

  test("ignores excluded directories", () => {
    const guides = createGroup("Guides", [
      createLink("/guides/a/"),
      createGroup("Advanced", [createLink("/guides/advanced/c/")]),
    ]);

    expect(
      getSidebarOverviews([guides], {
        ...options,
        config: createConfig({ exclude: ["guides/*"] }),
      }).map(({ directory }) => directory)
    ).toEqual(["guides"]);
  });

  test("supports localized links", () => {
    const context = createContext({ hasRootLocale: true, locales: ["fr"] });
    const localizedDocs = createDocs(
      [createEntry("guides/a"), createEntry("fr/guides/a")],
      context
    );
    const guides = createGroup("Guides", [createLink("/fr/guides/a/")]);

    expect(
      getSidebarOverviews([guides], {
        ...options,
        context,
        docs: localizedDocs,
        locale: "fr",
      })
    ).toEqual([
      {
        directory: "guides",
        group: guides,
        href: "/fr/guides/",
        slug: "fr/guides",
      },
    ]);
  });
});

describe("insertOverviewLinks", () => {
  test("adds a link to the overview page at the start of groups", () => {
    const guides = createGroup("Guides", [createLink("/guides/a/")]);
    const overviews = getSidebarOverviews([guides], options);

    expect(
      insertOverviewLinks(overviews, {
        ...options,
        currentSlug: "guides",
        label: "Overview",
      })
    ).toBe(true);
    expect(guides.entries[0]).toEqual(
      createLink("/guides/", "Overview", true)
    );
  });

  test("does not add a link when the group already links to the overview page", () => {
    const reference = createGroup("Reference", [
      createLink("/reference/"),
      createLink("/reference/api/"),
    ]);
    const overviews = getSidebarOverviews([reference], options);

    expect(
      insertOverviewLinks(overviews, {
        ...options,
        currentSlug: "",
        label: "Overview",
      })
    ).toBe(false);
    expect(reference.entries).toHaveLength(2);
  });

  test("does not add a link to hidden index pages", () => {
    const secret = createGroup("Secret", [createLink("/secret/d/")]);
    const overviews = getSidebarOverviews([secret], options);

    expect(
      insertOverviewLinks(overviews, {
        ...options,
        currentSlug: "",
        label: "Overview",
      })
    ).toBe(false);
  });
});
