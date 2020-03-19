import { ENVIRONMENT } from "./config";

export const formatPort = (port: any) =>
  port ? parseInt(port, 10) : undefined;

export const formatEnv = (env: string | undefined): ENVIRONMENT => {
  if (env === "production") return "production";

  return "development";
};

export const initService = (Module: any): any => {
  const model = new Module.Model();
  return new Module.Service(model);
};
