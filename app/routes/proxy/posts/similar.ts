import type { Route } from "./+types/similar";
import { z } from "zod";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { getPosts } from "~/services/post.service";
import { apiClientContext, type ApiClient } from "~/context";

const SimilarPostsSchema = z.object({
  title: z
    .string()
    .min(1, "Title parameter is required for fetching similar posts"),
});

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext) as ApiClient;

  const url = new URL(request.url);
  const rawTitle = url.searchParams.get("title") || "";

  const result = SimilarPostsSchema.safeParse({ title: rawTitle });

  if (!result.success) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  const { title } = result.data;

  try {
    const workspace = await getCurrentWorkspace(api);

    const posts = await getPosts(api, workspace.id, {
      search: title,
    });

    return posts;
  } catch (error) {
    console.error(`Failed to fetch similar posts for title "${title}":`, error);

    return createResponse({
      status: "ERR",
    });
  }
}
