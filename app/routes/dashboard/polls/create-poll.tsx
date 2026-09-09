import { ListChecks } from "lucide-react";
import PollForm from "~/components/dashboard/polls/form";
import { PageHeader } from "~/components/ui/page-header";
import { SEO_CONFIG } from "~/constants/seo";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.poll.create.title }];
}

export default function CreatePoll() {
  return (
    <div className="w-full flex flex-col gap-6 p-3">
      <PageHeader
        icon={ListChecks}
        title="ایجاد نظرسنجی"
        description="در این بخش می‌توانید یک نظرسنجی جدید ایجاد کرده و گزینه‌های دلخواه خود را اضافه کنید."
      />

      <PollForm />
    </div>
  );
}
