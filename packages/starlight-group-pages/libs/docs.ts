import {
  getServedLocales,
  getSlugLocale,
  localizeSlug,
  stripSlugLocale,
} from "./locale";
import { getPathAncestors } from "./path";
import type { StarlightGroupPagesContext } from "./vite";

export function createDocsIndex(
  entries: DocsEntry[],
  context: DocsContext
): DocsIndex {
  const pages = entries.map((entry) => getDocsPage(entry, context));

  return {
    directories: new Map(
      getServedLocales(context).map((locale) => [
        locale,
        getDirectories(getLocalePages(pages, locale, context)),
      ])
    ),
    pages: new Map(pages.map((page) => [page.id, page])),
  };
}

export function findDocsPage(
  docs: DocsIndex,
  slug: string,
  locale: string | undefined,
  context: Pick<StarlightGroupPagesContext, "defaultLocale">
): DocsPage | undefined {
  return (
    docs.pages.get(localizeSlug(slug, locale)) ??
    docs.pages.get(localizeSlug(slug, context.defaultLocale))
  );
}

export function getLocaleDirectories(
  docs: DocsIndex,
  locale: string | undefined
): Set<string> {
  return docs.directories.get(locale) ?? new Set();
}

export function getLocalePages(
  pages: Iterable<DocsPage>,
  locale: string | undefined,
  context: Pick<StarlightGroupPagesContext, "defaultLocale">
): DocsPage[] {
  return [...pages].filter(
    (page) => page.locale === locale || page.locale === context.defaultLocale
  );
}

function getDocsPage(entry: DocsEntry, context: DocsContext): DocsPage {
  const { description, sidebar, title } = entry.data;

  return {
    description,
    hidden: sidebar.hidden,
    id: entry.id,
    label: sidebar.label ?? title,
    locale: getSlugLocale(entry.id, context),
    order: sidebar.order,
    slug: stripSlugLocale(entry.id, context),
    title,
  };
}

function getDirectories(pages: DocsPage[]): Set<string> {
  return new Set(
    pages
      .filter((page) => !page.hidden)
      .flatMap((page) => getPathAncestors(page.slug))
  );
}

type DocsContext = Pick<
  StarlightGroupPagesContext,
  "defaultLocale" | "hasRootLocale" | "locales"
>;

export interface DocsEntry {
  id: string;
  data: {
    description?: string | undefined;
    sidebar: {
      hidden: boolean;
      label?: string | undefined;
      order?: number | undefined;
    };
    title: string;
  };
}

export interface DocsIndex {
  directories: Map<string | undefined, Set<string>>;
  pages: Map<string, DocsPage>;
}

export interface DocsPage {
  description: string | undefined;
  hidden: boolean;
  id: string;
  label: string;
  locale: string | undefined;
  order: number | undefined;
  slug: string;
  title: string;
}
