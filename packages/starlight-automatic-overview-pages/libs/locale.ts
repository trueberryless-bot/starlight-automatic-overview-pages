import { getPathSegments } from "./path";
import type { StarlightAutomaticOverviewPagesContext } from "./vite";

export function getSlugLocale(
  slug: string,
  context: Pick<StarlightAutomaticOverviewPagesContext, "locales">
): string | undefined {
  const [firstSegment] = getPathSegments(slug);

  return firstSegment && context.locales.includes(firstSegment)
    ? firstSegment
    : undefined;
}

export function stripSlugLocale(
  slug: string,
  context: Pick<StarlightAutomaticOverviewPagesContext, "locales">
): string {
  const segments = getPathSegments(slug);
  const locale = getSlugLocale(slug, context);

  return (locale ? segments.slice(1) : segments).join("/");
}

export function localizeSlug(slug: string, locale: string | undefined): string {
  if (!locale) return slug;

  return slug ? `${locale}/${slug}` : locale;
}

export function getServedLocales(
  context: Pick<
    StarlightAutomaticOverviewPagesContext,
    "hasRootLocale" | "locales"
  >
): (string | undefined)[] {
  return context.hasRootLocale || context.locales.length === 0
    ? [undefined, ...context.locales]
    : context.locales;
}
