import { api, type RequestOptions } from "./client";
import { getSubdomain } from "../utils";

export const createApiClient = (
  accessToken: string | null,
  request?: Request,
  url?: URL,
) => {
  const subdomain = url ? getSubdomain(url) : null;
  const sdkToken = request?.headers.get("x-sdk-token");

  const withHeader = (opts: RequestOptions = {}): RequestOptions => ({
    ...opts,
    headers: {
      ...opts.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(sdkToken ? { "x-sdk-token": sdkToken } : {}),
      ...(subdomain ? { "x-subdomain": subdomain } : {}),
    },
  });

  return {
    get: <TData>(path: string, opts?: RequestOptions) =>
      api.get<TData>(path, withHeader(opts)),

    post: <TData, TBody = Record<string, never>>(
      path: string,
      body?: TBody,
      opts?: RequestOptions & { isFormData?: boolean },
    ) => api.post<TData, TBody>(path, body, withHeader(opts)),

    patch: <TData, TBody = Record<string, never>>(
      path: string,
      body?: TBody,
      opts?: RequestOptions & { isFormData?: boolean },
    ) => api.patch<TData, TBody>(path, body, withHeader(opts)),

    del: <TData>(path: string, opts?: RequestOptions) =>
      api.del<TData>(path, withHeader(opts)),
  };
};
