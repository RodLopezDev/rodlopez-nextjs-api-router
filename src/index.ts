import { NextApiRequest, NextApiResponse } from "next";

export type Methods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

type ApiExecution = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<{ status: number; data: any }>;

type ExceptionHandle = (e: any) => { status: number; data: any };

interface ApiRoute {
  run: ApiExecution;
  errorHandler?: ExceptionHandle;
}

export type ApiRouteConfig = { [key in Methods]?: ApiRoute };

export type DefaultExceptionHandler = (cause: string) => any;

export const generateApiRoute = (
  api: ApiRouteConfig,
  defaultExceptionHandler: DefaultExceptionHandler = () => {}
) => {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiRoute = api?.[(req?.method || "GET") as Methods];
    if (!apiRoute) {
      return res.status(404).json({ errorMessage: "Route not found" });
    }

    try {
      const result = await apiRoute.run(req, res);
      return res.status(result.status).json(result.data);
    } catch (e: any) {
      if (typeof apiRoute?.errorHandler === "function") {
        const errorHandled = apiRoute.errorHandler(e);
        return res.status(errorHandled.status).json(errorHandled.data);
      }
      return res.status(500).json({ errorMessage: e?.message });
    }
  };
};
