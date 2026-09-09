import { optionalAuthMiddleware } from "~/middleware/optional-auth.server";

export const middleware = [optionalAuthMiddleware];
