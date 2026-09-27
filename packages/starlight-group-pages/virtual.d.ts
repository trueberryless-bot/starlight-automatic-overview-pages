declare module "virtual:starlight-group-pages/config" {
  const StarlightGroupPagesConfig: import("./libs/config").StarlightGroupPagesConfig;

  export default StarlightGroupPagesConfig;
}

declare module "virtual:starlight-group-pages/context" {
  const StarlightGroupPagesContext: import("./libs/vite").StarlightGroupPagesContext;

  export default StarlightGroupPagesContext;
}
