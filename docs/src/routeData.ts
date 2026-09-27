import {
  type StarlightRouteData,
  defineRouteMiddleware,
} from "@astrojs/starlight/route-data";

const wordRegEx = /\p{Letter}\S*/gu;

export const onRequest = defineRouteMiddleware((context) => {
  titleCaseGroupLabels(context.locals.starlightRoute.sidebar);
});

function titleCaseGroupLabels(entries: StarlightRouteData["sidebar"]) {
  for (const entry of entries) {
    if (entry.type !== "group") continue;

    entry.label = entry.label.replace(
      wordRegEx,
      (word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`
    );
    titleCaseGroupLabels(entry.entries);
  }
}
