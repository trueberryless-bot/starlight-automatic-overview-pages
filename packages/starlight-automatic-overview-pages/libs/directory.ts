import picomatch from "picomatch";

import type { StarlightAutomaticOverviewPagesConfig } from "./config";
import { type DocsIndex, findDocsPage, getLocaleDirectories } from "./docs";
import type { StarlightAutomaticOverviewPagesContext } from "./vite";

export function getOverviewDirectories(
  docs: DocsIndex,
  locale: string | undefined,
  config: Pick<StarlightAutomaticOverviewPagesConfig, "exclude">
): string[] {
  return [...getLocaleDirectories(docs, locale)]
    .filter((directory) => !isExcludedDirectory(directory, config))
    .sort();
}

export function isOverviewDirectory(
  directory: string,
  docs: DocsIndex,
  locale: string | undefined,
  config: Pick<StarlightAutomaticOverviewPagesConfig, "exclude">
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
  context: Pick<StarlightAutomaticOverviewPagesContext, "defaultLocale">
): boolean {
  return findDocsPage(docs, directory, locale, context) !== undefined;
}

function isExcludedDirectory(
  directory: string,
  config: Pick<StarlightAutomaticOverviewPagesConfig, "exclude">
): boolean {
  return (
    config.exclude.length > 0 && picomatch.isMatch(directory, config.exclude)
  );
}
