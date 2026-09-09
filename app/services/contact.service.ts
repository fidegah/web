import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";

type CreateContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function createContact(
  api: ApiClient,
  body: CreateContactInput,
): Promise<void> {
  await api.post<void, CreateContactInput>(apiRoutes.contact, body);
}
