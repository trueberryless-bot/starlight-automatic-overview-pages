import picomatch from "picomatch";

import type { StarlightGroupPagesConfig } from "./config";
import { type DocsIndex, findDocsPage, getLocaleDirectories } from "./docs";
import type { StarlightGroupPagesContext } from "./vite";

export function getOverviewDirectories(
  docs: DocsIndex,
  locale: string | undefined,
  config: Pick<StarlightGroupPagesConfig, "exclude">
): string[] {
  return [...getLocaleDirectories(docs, locale)]
    .filter((directory) => !isExcludedDirectory(directory, config))
    .sort();
}

export function isOverviewDirectory(
  directory: string,
  docs: DocsIndex,
  locale: string | undefined,
  config: Pick<StarlightGroupPagesConfig, "exclude">
): boolean {
  return (
    getLocaleDirectories(docs, locale).has(directory) &&
    !isExcludedDirectory(directory, config)
  );
}

export function hasDirectoryPage(
  directory: string,
  locale: string | undefined,
  docs: DocsIndex,
  context: Pick<StarlightGroupPagesContext, "defaultLocale">
): boolean {
  return findDocsPage(docs, directory, locale, context) !== undefined;
}

function isExcludedDirectory(
  directory: string,
  config: Pick<StarlightGroupPagesConfig, "exclude">
): boolean {
  return (
    config.exclude.length > 0 && picomatch.isMatch(directory, config.exclude)
  );
}
