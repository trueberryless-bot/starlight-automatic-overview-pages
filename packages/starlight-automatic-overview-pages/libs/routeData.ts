import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import config from "virtual:starlight-automatic-overview-pages/config";
import context from "virtual:starlight-automatic-overview-pages/context";

import { getDocsIndex } from "./content";
import { hasDirectoryPage, isOverviewDirectory } from "./directory";
import { stripSlugLocale } from "./locale";
import {
  type Overview,
  type OverviewOptions,
  getDirectoryOverview,
  getGroupOverview,
} from "./overview";
import { getPagination } from "./pagination";
import { stripLeadingAndTrailingSlashes } from "./path";
import { getSidebarOverviews, insertOverviewLinks } from "./sidebar";

export async function updateStarlightRoute(
  starlightRoute: StarlightRouteData,
  t: Translate
): Promise<StarlightAutomaticOverviewPagesRouteData> {
  const docs = await getDocsIndex();
  const sidebarOptions = {
    config,
    context,
    docs,
    locale: starlightRoute.locale,
  };
  const currentSlug = stripLeadingAndTrailingSlashes(starlightRoute.id);
  const overviews = getSidebarOverviews(starlightRoute.sidebar, sidebarOptions);
  const overview = getCurrentOverview(starlightRoute, {
    ...sidebarOptions,
    currentSlug,
    overviews,
  });

  if (config.sidebarLink) {
    const label = t("starlightAutomaticOverviewPages.sidebarLink");

    if (
      insertOverviewLinks(overviews, { ...sidebarOptions, currentSlug, label })
    ) {
      starlightRoute.pagination = getPagination(
        starlightRoute.sidebar,
        context.pagination,
        starlightRoute.entry.data
      );
    }
  }

  return { overview };
}

function getCurrentOverview(
  starlightRoute: StarlightRouteData,
  options: OverviewOptions
): Overview | undefined {
  const directory = stripSlugLocale(options.currentSlug, context);

  if (!isOverviewDirectory(directory, options.docs, options.locale, config)) {
    return undefined;
  }

  const isGeneratedPage = !hasDirectoryPage(
    directory,
    options.locale,
    options.docs,
    context
  );

  if (!isGeneratedPage && !config.extendIndexPages) return undefined;

  const sidebarOverview = options.overviews.find(
    (overview) => overview.slug === options.currentSlug
  );
  const overview = sidebarOverview
    ? getGroupOverview(sidebarOverview, options)
    : getDirectoryOverview(directory, options);

  if (isGeneratedPage) updatePageTitle(starlightRoute, overview.title);

  return overview;
}

function updatePageTitle(starlightRoute: StarlightRouteData, title: string) {
  const previousTitle = starlightRoute.entry.data.title;

  starlightRoute.entry.data.title = title;
  starlightRoute.head = starlightRoute.head.map((tag) =>
    getUpdatedHeadTag(tag, previousTitle, title)
  );
}

function getUpdatedHeadTag(
  tag: HeadTag,
  previousTitle: string,
  title: string
): HeadTag {
  if (tag.tag === "title" && tag.content?.startsWith(previousTitle)) {
    return {
      ...tag,
      content: `${title}${tag.content.slice(previousTitle.length)}`,
    };
  }

  if (
    tag.tag === "meta" &&
    tag.attrs?.["property"] === "og:title" &&
    tag.attrs["content"] === previousTitle
  ) {
    return { ...tag, attrs: { ...tag.attrs, content: title } };
  }

  return tag;
}

export interface StarlightAutomaticOverviewPagesRouteData {
  overview: Overview | undefined;
}

type HeadTag = StarlightRouteData["head"][number];
type Translate = (key: keyof StarlightApp.I18n) => string;
