import type { StarlightRouteData } from "@astrojs/starlight/route-data";

import {
  type SidebarEntry,
  type SidebarLink,
  getSidebarLinks,
} from "./sidebar";

export function getPagination(
  sidebar: SidebarEntry[],
  paginationEnabled: boolean,
  frontmatter: Pick<PageFrontmatter, "next" | "prev">
): StarlightRouteData["pagination"] {
  const links = getSidebarLinks(sidebar);
  const currentIndex = links.findIndex((link) => link.isCurrent);

  return {
    prev: applyPaginationLinkConfig(
      currentIndex > 0 ? links[currentIndex - 1] : undefined,
      paginationEnabled,
      frontmatter.prev
    ),
    next: applyPaginationLinkConfig(
      currentIndex > -1 ? links[currentIndex + 1] : undefined,
      paginationEnabled,
      frontmatter.next
    ),
  };
}

function applyPaginationLinkConfig(
  link: SidebarLink | undefined,
  paginationEnabled: boolean,
  linkConfig: PaginationLinkConfig
): SidebarLink | undefined {
  if (linkConfig === false) return undefined;
  if (linkConfig === true) return link;
  if (typeof linkConfig === "string") {
    return link ? { ...link, label: linkConfig } : undefined;
  }
  if (typeof linkConfig === "object") {
    return getCustomPaginationLink(link, linkConfig);
  }

  return paginationEnabled ? link : undefined;
}

function getCustomPaginationLink(
  link: SidebarLink | undefined,
  linkConfig: Exclude<PaginationLinkConfig, boolean | string | undefined>
): SidebarLink | undefined {
  if (link) {
    return {
      ...link,
      label: linkConfig.label ?? link.label,
      href: linkConfig.link ?? link.href,
      attrs: {},
    };
  }

  if (!linkConfig.link || !linkConfig.label) return undefined;

  return {
    type: "link",
    label: linkConfig.label,
    href: linkConfig.link,
    isCurrent: false,
    badge: undefined,
    attrs: {},
  };
}

type PageFrontmatter = StarlightRouteData["entry"]["data"];
type PaginationLinkConfig = PageFrontmatter["prev"];
