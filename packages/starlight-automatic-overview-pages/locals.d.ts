declare namespace App {
  interface Locals {
    starlightAutomaticOverviewPages: import("./libs/routeData").StarlightAutomaticOverviewPagesRouteData;
  }
}

declare namespace StarlightApp {
  type Translations = typeof import("./translations").Translations.en;
  interface I18n extends Translations {}
}
