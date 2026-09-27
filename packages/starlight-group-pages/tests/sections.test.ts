import { describe, expect, test } from "vitest";

import type { OverviewLink } from "../libs/overview";
import {
  escapeHtml,
  getHeadingId,
  getHeadingTag,
  getLinkCardProps,
  getOverviewSections,
} from "../libs/sections";

function createOverviewLink(label: string): OverviewLink {
  return { type: "link", label, href: `/${label}/`, description: undefined };
}

describe("getOverviewSections", () => {
  test("groups consecutive links", () => {
    const group = { type: "group" as const, label: "G", entries: [] };

    expect(
      getOverviewSections([
        createOverviewLink("a"),
        createOverviewLink("b"),
        group,
        createOverviewLink("c"),
      ])
    ).toEqual([
      {
        type: "links",
        links: [createOverviewLink("a"), createOverviewLink("b")],
      },
      { type: "group", group },
      { type: "links", links: [createOverviewLink("c")] },
    ]);
  });
});

describe("getLinkCardProps", () => {
  test("escapes the title and description", () => {
    expect(
      getLinkCardProps({
        type: "link",
        label: "<b>",
        href: "/a/",
        description: "Tom & Jerry",
      })
    ).toEqual({
      description: "Tom &amp; Jerry",
      href: "/a/",
      title: "&lt;b&gt;",
    });
  });

  test("omits missing descriptions", () => {
    expect(getLinkCardProps(createOverviewLink("a"))).toEqual({
      href: "/a/",
      title: "a",
    });
  });
});

describe("getHeadingTag", () => {
  test("clamps the heading level", () => {
    expect(getHeadingTag(1)).toBe("h2");
    expect(getHeadingTag(3)).toBe("h3");
    expect(getHeadingTag(9)).toBe("h6");
  });
});

describe("getHeadingId", () => {
  test("slugifies labels", () => {
    expect(getHeadingId("Advanced Guides")).toBe("advanced-guides");
    expect(getHeadingId("Guías avanzadas!")).toBe("guias-avanzadas");
    expect(getHeadingId("概览")).toBe("概览");
  });
});

describe("escapeHtml", () => {
  test("escapes HTML special characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;"
    );
  });
});
