import type { Pagination } from "~/types";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type RequestOptions = {
  headers?: HeadersInit;
  signal?: AbortSignal;
  params?: Record<string, string | number | boolean>;
};

type BodyRequestOptions = RequestOptions & {
  body?: unknown;
  isFormData?: boolean;
};

type ApiResult<TData> = {
  message: string | undefined;
  data: TData;
  pagination: Pagination;
};

export class ApiError extends Error {
  code: string;
  description: string;
  timestamp: string;
  url?: string;
  method?: HttpMethod;

  constructor(
    code: string,
    message: string,
    description: string,
    timestamp: string,
    url?: string,
    method?: HttpMethod,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.description = description;
    this.timestamp = timestamp;
    this.url = url;
    this.method = method;
  }
}

function parseHeaders(optionsHeaders?: HeadersInit): Record<string, string> {
  if (!optionsHeaders) return {};

  if (optionsHeaders instanceof Headers) {
    return Object.fromEntries(optionsHeaders.entries());
  }

  if (Array.isArray(optionsHeaders)) {
    return Object.fromEntries(optionsHeaders);
  }

  return { ...optionsHeaders };
}

async function request<TData>(
  baseUrl: string,
  path: string,
  method: HttpMethod,
  options: BodyRequestOptions = {},
): Promise<ApiResult<TData>> {
  const isBodyAllowed = method === "POST" || method === "PATCH";
  const isFormData = options.isFormData === true;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${cleanPath}`);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = parseHeaders(options.headers);

  if (isBodyAllowed && options.body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    signal: options.signal,
  };

  if (isBodyAllowed && options.body !== undefined) {
    if (isFormData && options.body instanceof FormData) {
      fetchOptions.body = options.body;
    } else {
      fetchOptions.body = JSON.stringify(options.body);
    }
  }

  const res = await fetch(url.toString(), fetchOptions);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      json?.errorCode ?? `HTTP_${res.status}`,
      Array.isArray(json?.message)
        ? json.message.join(", ")
        : (json?.message ?? "An error occurred"),
      json?.error ?? res.statusText,
      new Date().toISOString(),
      url.toString(),
      method,
    );
  }

  return {
    data: json.data,
    pagination: json.pagination,
    message: json.message,
  };
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = {
  get: <TData>(path: string, options?: RequestOptions) =>
    request<TData>(baseUrl, path, "GET", options),

  post: <TData, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions & { isFormData?: boolean },
  ) =>
    request<TData>(baseUrl, path, "POST", {
      ...options,
      body,
    }),

  patch: <TData, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: RequestOptions & { isFormData?: boolean },
  ) =>
    request<TData>(baseUrl, path, "PATCH", {
      ...options,
      body,
    }),

  del: <TData>(path: string, options?: RequestOptions) =>
    request<TData>(baseUrl, path, "DELETE", options),
};
