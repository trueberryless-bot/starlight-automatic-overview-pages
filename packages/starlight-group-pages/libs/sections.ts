import type { OverviewEntry, OverviewGroup, OverviewLink } from "./overview";

const maxHeadingLevel = 6;

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function getOverviewSections(
  entries: OverviewEntry[]
): OverviewSection[] {
  return entries.reduce<OverviewSection[]>((sections, entry) => {
    const lastSection = sections.at(-1);

    if (entry.type === "group") {
      sections.push({ type: "group", group: entry });
    } else if (lastSection?.type === "links") {
      lastSection.links.push(entry);
    } else {
      sections.push({ type: "links", links: [entry] });
    }

    return sections;
  }, []);
}

export function getLinkCardProps(link: OverviewLink): LinkCardProps {
  return {
    href: link.href,
    title: escapeHtml(link.label),
    ...(link.description ? { description: escapeHtml(link.description) } : {}),
  };
}

export function getHeadingTag(level: number): HeadingTag {
  return `h${Math.min(Math.max(level, 2), maxHeadingLevel)}` as HeadingTag;
}

export function getHeadingId(label: string): string {
  return label
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) => htmlEscapes[character] ?? character
  );
}

interface LinkCardProps {
  description?: string;
  href: string;
  title: string;
}

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

export type OverviewSection =
  | { type: "group"; group: OverviewGroup }
  | { type: "links"; links: OverviewLink[] };
