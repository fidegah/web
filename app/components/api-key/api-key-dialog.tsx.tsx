import { Activity, type Dispatch, type SetStateAction } from "react";
import { type FetcherWithComponents } from "react-router";
import type { ApiKey, CreateResponse } from "~/types";
import ApiKeyForm from "./api-key-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface ApiKeyDialogProps {
  fetcher: FetcherWithComponents<
    CreateResponse<{ api_key: string; method?: string }>
  >;
  open: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  keyName: string;
  setKeyName: Dispatch<SetStateAction<string>>;
  keyToEdit: ApiKey | null;
  setKeyToEdit: Dispatch<SetStateAction<ApiKey | null>>;
}

export default function ApiKeyDialog({
  fetcher,
  open,
  setDialogOpen,
  keyName,
  setKeyName,
  keyToEdit,
  setKeyToEdit,
}: Readonly<ApiKeyDialogProps>) {
  const fetcherData = fetcher.data;

  const apiKey = fetcherData?.data?.api_key;
  const isEditing = !!keyToEdit;

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "ویرایش کلید API" : "ساخت کلید API جدید"}
          </DialogTitle>
          <DialogDescription>
            <Activity mode={apiKey ? "hidden" : "visible"}>
              {isEditing
                ? "برای ویرایش، نام جدید را وارد کنید."
                : " برای ساخت کلید جدید، یک نام برای آن وارد کنید."}
            </Activity>

            <Activity mode={apiKey ? "visible" : "hidden"}>
              <div className="mt-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-amber-800 dark:text-amber-300 text-sm">
                    نکات امنیتی مهم:
                  </span>
                </div>

                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1.5 pr-5 list-disc">
                  <li>
                    این کلید <span className="font-bold">فقط یک بار</span> نمایش
                    داده می‌شود و پس از بستن صفحه قابل بازیابی نیست
                  </li>
                  <li>کلید را مانند رمز عبور در جای امن ذخیره کنید</li>
                  <li>
                    هرگز کلید را در کدهای کلاینت (JavaScript مرورگر) یا مخازن
                    عمومی قرار ندهید
                  </li>
                  <li>
                    در صورت لو رفتن، بلافاصله از طریق پنل مدیریت این کلید را
                    غیرفعال کنید
                  </li>
                </ul>
              </div>
            </Activity>
          </DialogDescription>
        </DialogHeader>

        <ApiKeyForm
          fetcher={fetcher}
          isEditing={isEditing}
          keyName={keyName}
          setKeyName={setKeyName}
          keyToEdit={keyToEdit}
          setKeyToEdit={setKeyToEdit}
          setModalOpen={setDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
