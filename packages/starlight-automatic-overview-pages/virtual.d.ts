declare module "virtual:starlight-automatic-overview-pages/config" {
  const StarlightAutomaticOverviewPagesConfig: import("./libs/config").StarlightAutomaticOverviewPagesConfig;

  export default StarlightAutomaticOverviewPagesConfig;
}

declare module "virtual:starlight-automatic-overview-pages/context" {
  const StarlightAutomaticOverviewPagesContext: import("./libs/vite").StarlightAutomaticOverviewPagesContext;

  export default StarlightAutomaticOverviewPagesContext;
}
