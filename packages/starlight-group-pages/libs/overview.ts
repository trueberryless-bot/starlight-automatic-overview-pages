import type { StarlightGroupPagesConfig } from "./config";
import { isOverviewDirectory } from "./directory";
import {
  type DocsIndex,
  type DocsPage,
  findDocsPage,
  getLocaleDirectories,
  getLocalePages,
} from "./docs";
import { localizeSlug, stripSlugLocale } from "./locale";
import { getParentPath, getPathName, hrefToSlug, slugToHref } from "./path";
import type { SidebarEntry, SidebarLink, SidebarOverview } from "./sidebar";
import type { StarlightGroupPagesContext } from "./vite";

const collator = new Intl.Collator();

export function getGroupOverview(
  overview: SidebarOverview,
  options: OverviewOptions
): Overview {
  return {
    title: overview.group.label,
    entries: getGroupOverviewEntries(overview.group.entries, options),
  };
}

export function getDirectoryOverview(
  directory: string,
  options: OverviewOptions
): Overview {
  const indexPage = getDirectoryPage(directory, options);

  return {
    title: indexPage?.title ?? getPathName(directory),
    entries: [
      ...getChildPages(directory, options),
      ...getChildDirectories(directory, options),
    ]
      .sort(compareDirectoryEntries)
      .map(({ entry }) => entry),
  };
}

function getGroupOverviewEntries(
  entries: SidebarEntry[],
  options: OverviewOptions
): OverviewEntry[] {
  return entries.flatMap((entry): OverviewEntry[] => {
    if (entry.type === "link") {
      return isCurrentLink(entry, options)
        ? []
        : [getLinkOverviewEntry(entry, options)];
    }

    const groupOverview = options.overviews.find(
      (overview) => overview.group === entry
    );

    if (groupOverview) {
      return [
        {
          type: "link",
          label: entry.label,
          href: groupOverview.href,
          description: getDirectoryPage(groupOverview.directory, options)
            ?.description,
        },
      ];
    }

    const groupEntries = getGroupOverviewEntries(entry.entries, options);

    return groupEntries.length > 0
      ? [{ type: "group", label: entry.label, entries: groupEntries }]
      : [];
  });
}

function getLinkOverviewEntry(
  link: SidebarLink,
  options: OverviewOptions
): OverviewLink {
  const slug = hrefToSlug(link.href, options.context);
  const page =
    slug === undefined
      ? undefined
      : findDocsPage(
          options.docs,
          stripSlugLocale(slug, options.context),
          options.locale,
          options.context
        );

  return {
    type: "link",
    label: link.label,
    href: link.href,
    description: page?.description,
  };
}

function isCurrentLink(link: SidebarLink, options: OverviewOptions): boolean {
  return (
    link.isCurrent ||
    hrefToSlug(link.href, options.context) === options.currentSlug
  );
}

function getChildPages(
  directory: string,
  options: OverviewOptions
): SortableOverviewEntry[] {
  const directories = getLocaleDirectories(options.docs, options.locale);
  const slugs = new Set(
    getLocalePages(options.docs.pages.values(), options.locale, options.context)
      .filter(
        (page) =>
          getParentPath(page.slug) === directory && !directories.has(page.slug)
      )
      .map((page) => page.slug)
  );

  return [...slugs]
    .map((slug) =>
      findDocsPage(options.docs, slug, options.locale, options.context)
    )
    .filter((page): page is DocsPage => page !== undefined && !page.hidden)
    .map((page) => ({
      entry: getPageOverviewEntry(page, options),
      order: page.order,
      slug: page.slug,
    }));
}

function getChildDirectories(
  directory: string,
  options: OverviewOptions
): SortableOverviewEntry[] {
  return [...getLocaleDirectories(options.docs, options.locale)]
    .filter((childDirectory) => getParentPath(childDirectory) === directory)
    .flatMap((childDirectory) => {
      const page = getDirectoryPage(childDirectory, options);

      if (page?.hidden) return [];
      if (
        !page &&
        !isOverviewDirectory(
          childDirectory,
          options.docs,
          options.locale,
          options.config
        )
      ) {
        return [];
      }

      return [
        {
          entry: {
            type: "link" as const,
            label: page?.label ?? getPathName(childDirectory),
            href: getLocalizedHref(childDirectory, options),
            description: page?.description,
          },
          order: page?.order,
          slug: childDirectory,
        },
      ];
    });
}

function getPageOverviewEntry(
  page: DocsPage,
  options: OverviewOptions
): OverviewLink {
  return {
    type: "link",
    label: page.label,
    href: getLocalizedHref(page.slug, options),
    description: page.description,
  };
}

function getDirectoryPage(
  directory: string,
  options: OverviewOptions
): DocsPage | undefined {
  return findDocsPage(options.docs, directory, options.locale, options.context);
}

function getLocalizedHref(slug: string, options: OverviewOptions): string {
  return slugToHref(localizeSlug(slug, options.locale), options.context);
}

function compareDirectoryEntries(
  a: SortableOverviewEntry,
  b: SortableOverviewEntry
): number {
  const orderA = a.order ?? Number.MAX_VALUE;
  const orderB = b.order ?? Number.MAX_VALUE;

  if (orderA !== orderB) return orderA < orderB ? -1 : 1;

  return collator.compare(a.slug, b.slug);
}

export interface OverviewOptions {
  config: Pick<StarlightGroupPagesConfig, "exclude">;
  context: StarlightGroupPagesContext;
  currentSlug: string;
  docs: DocsIndex;
  locale: string | undefined;
  overviews: SidebarOverview[];
}

export interface Overview {
  title: string;
  entries: OverviewEntry[];
}

export type OverviewEntry = OverviewLink | OverviewGroup;

export interface OverviewLink {
  type: "link";
  label: string;
  href: string;
  description: string | undefined;
}

export interface OverviewGroup {
  type: "group";
  label: string;
  entries: OverviewEntry[];
}

interface SortableOverviewEntry {
  entry: OverviewLink;
  order: number | undefined;
  slug: string;
}
