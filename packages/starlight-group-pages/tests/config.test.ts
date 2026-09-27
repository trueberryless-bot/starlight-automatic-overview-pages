import { AstroError } from "astro/errors";
import { describe, expect, test } from "vitest";

import { validateConfig } from "../libs/config";

describe("validateConfig", () => {
  test("returns the default configuration", () => {
    expect(validateConfig(undefined)).toEqual({
      exclude: [],
      extendIndexPages: true,
      layout: "grid",
      sidebarLink: true,
    });
  });

  test("returns a custom configuration", () => {
    expect(
      validateConfig({
        exclude: ["reference/**"],
        extendIndexPages: false,
        layout: "list",
        sidebarLink: false,
      })
    ).toEqual({
      exclude: ["reference/**"],
      extendIndexPages: false,
      layout: "list",
      sidebarLink: false,
    });
  });

  test("throws a readable error for invalid configurations", () => {
    expect(() => validateConfig({ layout: "table" })).toThrow(AstroError);
    expect(() => validateConfig({ layout: "table" })).toThrow(
      /Invalid starlight-group-pages configuration:[\s\S]*layout/
    );
  });
});
