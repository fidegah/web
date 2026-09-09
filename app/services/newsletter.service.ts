import { api } from "~/lib/api/client";
import { apiRoutes } from "~/lib/api/routes";

type SubscribeNewsletterInput = {
  email: string;
};

export async function subscribeNewsletter(
  body: SubscribeNewsletterInput,
): Promise<void> {
  await api.post<void, SubscribeNewsletterInput>(
    apiRoutes.newsletter.subscribe,
    body,
  );
}
