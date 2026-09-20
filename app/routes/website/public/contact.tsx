import BasePublicPageLayout from "~/components/website/public/base-layout";
import type { Route } from "./+types/contact";
import { MessageSquare } from "lucide-react";
import ContactForm from "~/components/website/public/contact-form";
import { MESSAGES } from "~/constants/messages";
import { CONTACT_PAGE_CONTENT } from "~/constants/public-page/contact";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import { useActionAlert } from "~/hooks/use-action-alert";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { contactSchema } from "~/schemas/website/public-page/contact";
import { createContact } from "~/services/contact.service";
import { apiClientContext } from "~/context";

export function meta({ location }: Route.MetaArgs) {
  const config = SEO_CONFIG.publicPage.contact;
  const { title, description, ogTitle } = config;
  const canonicalUrl = getCanonicalUrl(location.pathname);

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:type", content: "website" },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  const result = contactSchema.safeParse({ name, email, subject, message });

  if (result.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    await createContact(api, {
      name,
      email,
      subject,
      message,
    });
  } catch (error) {
    console.error(
      `Contact form submission failed for email "${email}":`,
      error,
    );

    return createResponse({
      status: "ERR",
      message: MESSAGES.CONTACT.CREATION_ERROR,
    });
  }
}

export default function ContactPage({ actionData }: Route.ComponentProps) {
  useActionAlert(actionData);
  const { title, description } = CONTACT_PAGE_CONTENT;

  return (
    <BasePublicPageLayout
      title={title}
      headerIcon={MessageSquare}
      description={description}
    >
      <div className="p-6 md:p-8 bg-linear-to-br from-zinc-50/50 to-white dark:from-zinc-900/10 dark:to-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs">
        <ContactForm />
      </div>
    </BasePublicPageLayout>
  );
}
