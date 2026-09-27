declare namespace App {
  interface Locals {
    starlightGroupPages: import("./libs/routeData").StarlightGroupPagesRouteData;
  }
}

declare namespace StarlightApp {
  type Translations = typeof import("./translations").Translations.en;
  interface I18n extends Translations {}
}
