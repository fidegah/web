import { type LucideIcon } from "lucide-react";
import Input from "~/components/ui/input-custom";
import ErrorMessage from "~/components/ui/error-message";
import SubmitButton from "~/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";

interface EntityCreateCardProps {
  createTitle: string;
  inputPlaceholder: string;
  submitLabel: string;
  icon: LucideIcon;
}

export default function EntityCreateCard({
  createTitle,
  inputPlaceholder,
  submitLabel,
  icon: Icon,
}: Readonly<EntityCreateCardProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{createTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <fetcher.Form
          method="POST"
          className="grid grid-cols-1 gap-6 p-1 lg:p-2"
        >
          <Input
            icon={Icon}
            id="name"
            name="name"
            label="عنوان"
            placeholder={inputPlaceholder}
          />

          <ErrorMessage data={fetcher.data} />

          <SubmitButton
            label={submitLabel}
            className="col-span-1 lg:col-span-2 lg:w-1/4 mt-3"
            isLoading={fetcher.state !== "idle"}
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}
