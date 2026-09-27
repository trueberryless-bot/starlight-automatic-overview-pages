import config from "virtual:starlight-group-pages/config";
import context from "virtual:starlight-group-pages/context";

import { getDocsIndex } from "./content";
import { getOverviewDirectories, hasDirectoryPage } from "./directory";
import { getServedLocales, localizeSlug } from "./locale";
import { getPathName } from "./path";

export async function getOverviewStaticPaths() {
  const docs = await getDocsIndex();

  return getServedLocales(context).flatMap((locale) =>
    getOverviewDirectories(docs, locale, config)
      .filter(
        (directory) => !hasDirectoryPage(directory, locale, docs, context)
      )
      .map((directory) => ({
        params: { groupPage: localizeSlug(directory, locale) },
        props: { title: getPathName(directory) },
      }))
  );
}
