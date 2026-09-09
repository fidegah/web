import {
  Edit,
  MailOpen,
  MessageCirclePlus,
  Phone,
  UserRound,
} from "lucide-react";
import { useFetcher } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import FilesSection from "~/components/dashboard/ticket/files-section";
import type { Route } from "./+types/ticket";
import { useActionAlert } from "~/hooks/use-action-alert";
import SubmitButton from "~/components/ui/submit-button";
import ErrorMessage from "~/components/ui/error-message";
import { SEO_CONFIG } from "~/constants/seo";
import { useEffect, useState } from "react";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { ticketSchema } from "~/schemas/dashboard/ticket";
import { getZodErrorMessages } from "~/lib/utils";
import Input from "~/components/ui/input-custom";
import Textarea from "~/components/ui/textarea";
import { createTicket } from "~/services/ticket.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export const meta = () => {
  return [{ title: SEO_CONFIG.dashboard.ticket.title }];
};

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);

  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const subject = formData.get("subject");
  const description = formData.get("description");
  const attachments = formData.getAll("attachments");

  const formDataObject = {
    name,
    email,
    phone,
    subject,
    description,
  };
  const result = ticketSchema.safeParse(formDataObject);

  if (result.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  const validAttachments = attachments.filter((item): item is File => {
    return item instanceof File && item.size > 0 && item.name !== "";
  });

  const apiFormData = new FormData();
  apiFormData.append("name", name as string);
  apiFormData.append("email", email as string);
  apiFormData.append("phone", phone as string);
  apiFormData.append("subject", subject as string);
  apiFormData.append("description", description as string);

  if (validAttachments.length > 0) {
    for (const file of validAttachments) {
      apiFormData.append("attachments", file);
    }
  }

  try {
    const workspace = await getCurrentWorkspace(api);

    await createTicket(api, workspace.id, {
      name: name as string,
      email: email as string,
      phone: phone as string,
      subject: subject as string,
      description: description as string,
      attachments: validAttachments,
    });

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.TICKET.CREATED,
    });
  } catch (err) {
    return createResponse({
      status: "ERR",
      message: MESSAGES.TICKET.CREATION_ERROR,
    });
  }
}

export default function Ticket() {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (fetcher.state !== "idle") return;

    if (fetcher.data?.status === "OK") {
      fetcher.reset();
      setSelectedFiles([]);
      setFormKey((prev) => prev + 1);
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div className="w-full flex flex-col p-3 min-h-0">
      <PageHeader
        icon={MessageCirclePlus}
        title="ارسال تیکت"
        description="در این بخش می‌توانید درخواست پشتیبانی خود را ثبت کرده و پاسخ آن را دریافت کنید."
      />

      <Card className="w-full mt-6">
        <CardContent>
          <fetcher.Form
            key={formKey}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            method="POST"
            encType="multipart/form-data"
          >
            <Input
              id="name"
              label="نام کامل"
              placeholder="نام و نام خانوادگی خود را وارد کنید."
              icon={UserRound}
            />
            <Input
              id="email"
              label="ایمیل"
              placeholder="ایمیل خود را وارد کنید."
              icon={MailOpen}
            />
            <Input
              id="phone"
              label="شماره تلفن"
              placeholder="شماره تماس خود را وارد کنید."
              icon={Phone}
            />
            <Input
              id="subject"
              label="موضوع"
              placeholder="موضوع تیکت خود را بنویسید."
              icon={Edit}
            />

            <div className="md:col-span-2">
              <Textarea
                id="description"
                label="توضیح"
                placeholder="توضیح کامل مشکل یا درخواست خود را وارد کنید."
              />
            </div>

            <FilesSection
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />

            <ErrorMessage data={fetcher.data} />

            <SubmitButton
              label="ارسال تیکت"
              isLoading={fetcher.state !== "idle"}
            />
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
