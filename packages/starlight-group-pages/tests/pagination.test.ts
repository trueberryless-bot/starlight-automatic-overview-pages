import { describe, expect, test } from "vitest";

import { getPagination } from "../libs/pagination";
import { createGroup, createLink } from "./mocks";

const sidebar = [
  createGroup("Guides", [
    createLink("/guides/", "Overview"),
    createLink("/guides/a/", "A", true),
    createLink("/guides/b/", "B"),
  ]),
];

describe("getPagination", () => {
  test("returns the previous and next links", () => {
    expect(getPagination(sidebar, true, {})).toEqual({
      prev: createLink("/guides/", "Overview"),
      next: createLink("/guides/b/", "B"),
    });
  });

  test("returns no links when pagination is disabled", () => {
    expect(getPagination(sidebar, false, {})).toEqual({
      prev: undefined,
      next: undefined,
    });
    expect(getPagination(sidebar, false, { prev: true })).toEqual({
      prev: createLink("/guides/", "Overview"),
      next: undefined,
    });
  });

  test("returns no links when the current page is not in the sidebar", () => {
    expect(getPagination([createLink("/a/")], true, {})).toEqual({
      prev: undefined,
      next: undefined,
    });
  });

  test("applies frontmatter overrides", () => {
    expect(
      getPagination(sidebar, true, {
        prev: false,
        next: "Custom label",
      })
    ).toEqual({
      prev: undefined,
      next: createLink("/guides/b/", "Custom label"),
    });
    expect(
      getPagination(sidebar, true, {
        prev: { link: "/custom/", label: "Custom" },
      }).prev
    ).toEqual(createLink("/custom/", "Custom"));
    expect(
      getPagination([createLink("/a/", "A", true)], true, {
        next: { link: "/custom/", label: "Custom" },
      }).next
    ).toEqual(createLink("/custom/", "Custom"));
  });
});
