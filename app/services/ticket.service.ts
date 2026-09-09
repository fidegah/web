import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";

type CreateTicketInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
  attachments?: File[];
};

export async function createTicket(
  api: ApiClient,
  workspaceId: string,
  body: CreateTicketInput,
): Promise<void> {
  const formData = new FormData();

  formData.append("name", body.name);
  formData.append("email", body.email);
  formData.append("phone", body.phone);
  formData.append("subject", body.subject);
  formData.append("description", body.description);

  for (const file of body.attachments ?? []) {
    formData.append("attachments", file);
  }

  await api.post<void, FormData>(
    apiRoutes.workspaces.tickets.base(workspaceId),
    formData,
    {
      isFormData: true,
    },
  );
}
