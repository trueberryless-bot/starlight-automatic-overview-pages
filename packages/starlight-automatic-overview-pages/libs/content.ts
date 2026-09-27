import { getCollection } from "astro:content";
import context from "virtual:starlight-automatic-overview-pages/context";

import { type DocsIndex, createDocsIndex } from "./docs";

let docsIndex: Promise<DocsIndex> | undefined;

export function getDocsIndex(): Promise<DocsIndex> {
  if (import.meta.env.DEV) return loadDocsIndex();

  docsIndex ??= loadDocsIndex();

  return docsIndex;
}

async function loadDocsIndex(): Promise<DocsIndex> {
  const entries = await getCollection(
    "docs",
    (entry) => !import.meta.env.PROD || !entry.data.draft
  );

  return createDocsIndex(entries, context);
}
