import type { StarlightAutomaticOverviewPagesContext } from "./vite";

const protocolPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function stripLeadingAndTrailingSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, "");
}

export function getPathSegments(path: string): string[] {
  return path.split("/").filter(Boolean);
}

export function getParentPath(path: string): string {
  return getPathSegments(path).slice(0, -1).join("/");
}

export function getPathName(path: string): string {
  return getPathSegments(path).at(-1) ?? "";
}

export function getPathAncestors(path: string): string[] {
  const segments = getPathSegments(path);

  return segments
    .slice(0, -1)
    .map((_, index) => segments.slice(0, index + 1).join("/"));
}

export function getCommonPath(paths: string[]): string {
  const [firstPath, ...otherPaths] = paths.map(getPathSegments);
  if (!firstPath) return "";

  const commonSegments = otherPaths.reduce(
    (common, segments) => getCommonSegments(common, segments),
    firstPath
  );

  return commonSegments.join("/");
}

export function isInternalHref(href: string): boolean {
  return (
    href.startsWith("/") &&
    !href.startsWith("//") &&
    !protocolPattern.test(href)
  );
}

export function hrefToSlug(
  href: string,
  context: Pick<StarlightAutomaticOverviewPagesContext, "base">
): string | undefined {
  if (!isInternalHref(href)) return undefined;

  const pathname = stripBase(decodePath(stripSearchAndHash(href)), context);
  const segments = getPathSegments(pathname);
  const lastSegment = segments.at(-1);

  if (lastSegment === "index.html") {
    segments.pop();
  } else if (lastSegment?.endsWith(".html")) {
    segments.splice(-1, 1, lastSegment.slice(0, -".html".length));
  }

  return segments.join("/");
}

export function slugToHref(
  slug: string,
  context: Pick<
    StarlightAutomaticOverviewPagesContext,
    "base" | "format" | "trailingSlash"
  >
): string {
  const path = stripLeadingAndTrailingSlashes(slug);

  if (context.format === "file") {
    return `${context.base}/${path || "index"}.html`;
  }

  const href = path ? `${context.base}/${path}/` : `${context.base}/`;

  return context.trailingSlash === "never" && href !== "/"
    ? href.slice(0, -1)
    : href;
}

function getCommonSegments(first: string[], second: string[]): string[] {
  const mismatchIndex = first.findIndex(
    (segment, index) => segment !== second[index]
  );

  return mismatchIndex === -1 ? first : first.slice(0, mismatchIndex);
}

function stripSearchAndHash(href: string): string {
  return href.replace(/[?#].*$/, "");
}

function stripBase(
  pathname: string,
  context: Pick<StarlightAutomaticOverviewPagesContext, "base">
): string {
  if (!context.base) return pathname;
  if (pathname === context.base) return "";

  return pathname.startsWith(`${context.base}/`)
    ? pathname.slice(context.base.length)
    : pathname;
}

function decodePath(path: string): string {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
}
