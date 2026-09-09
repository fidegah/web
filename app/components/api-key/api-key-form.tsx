import { Activity, type Dispatch, type SetStateAction } from "react";
import { type FetcherWithComponents } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { Input } from "~/components/ui/input";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import ErrorMessage from "~/components/ui/error-message";
import { Label } from "~/components/ui/label";
import type { ApiKey, CreateResponse } from "~/types";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import { DialogFooter } from "../ui/dialog";

interface ApiKeyFormProps {
  fetcher: FetcherWithComponents<any>;
  isEditing: boolean;
  keyToEdit: ApiKey | null;
  setKeyToEdit: Dispatch<SetStateAction<ApiKey | null>>;
  keyName: string;
  setKeyName: Dispatch<SetStateAction<string>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ApiKeyForm({
  fetcher,
  isEditing,
  keyToEdit,
  setKeyToEdit,
  keyName,
  setKeyName,
  setModalOpen,
}: Readonly<ApiKeyFormProps>) {
  const fetcherData = fetcher.data as CreateResponse & {
    data?: { api_key: string; method?: string };
  };

  const { copy } = useCopyToClipboard();

  const isSubmitting = fetcher.state !== "idle";
  const apiKey = fetcherData?.data?.api_key;

  const getButtonContent = () => {
    if (isSubmitting) return <Spinner />;
    if (apiKey) return "📋 کپی";
    if (isEditing) return "ویرایش ✏️";
    return "ایجاد کلید 🔑";
  };

  return (
    <fetcher.Form method={isEditing ? "PATCH" : "POST"}>
      <div className="py-4">
        <Activity mode={apiKey ? "hidden" : "visible"}>
          <Label htmlFor="keyName">نام کلید</Label>
          <Input
            id="keyName"
            name="keyName"
            placeholder="نام کلید را وارد نمایید."
            className="mt-2"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />

          <input type="hidden" name="keyId" value={keyToEdit?.id || ""} />

          <div className="mt-2">
            <ErrorMessage data={fetcherData} />
          </div>
        </Activity>

        <Activity mode={apiKey ? "visible" : "hidden"}>
          <div className="p-2 break-all text-sm border bg-card rounded-lg">
            {apiKey}
          </div>
        </Activity>
      </div>

      <DialogFooter>
        <RippleButton
          type={apiKey ? "button" : "submit"}
          disabled={(!keyName.trim() && !apiKey) || isSubmitting}
          onClick={() => {
            if (apiKey) {
              copy(apiKey);
              setModalOpen(false);
              fetcher.reset();
            }

            if (isEditing) setModalOpen(false);
          }}
        >
          {getButtonContent()}
        </RippleButton>

        <RippleButton
          variant="outline"
          type="button"
          onClick={() => {
            setModalOpen(false);

            if (isEditing) {
              setKeyToEdit(null);
            }
          }}
        >
          {apiKey ? "بستن" : "لغو"}
        </RippleButton>
      </DialogFooter>
    </fetcher.Form>
  );
}
