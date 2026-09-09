import { createContext } from "react-router";
import type { createApiClient } from "~/lib/api/index.server";

export type ApiClient = ReturnType<typeof createApiClient>;

export const apiClientContext = createContext<ApiClient>(null!);
