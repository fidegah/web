import { FolderPen, FolderSymlink } from "lucide-react";
import { useState } from "react";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Board } from "~/types";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import { Switch } from "~/components/ui/switch";

interface EditInfomationProps {
  board: Board;
}

export default function EditInfomationForm({
  board,
}: Readonly<EditInfomationProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const [boardData, setBoardData] = useState<Board>(board);
  const [isPrivate, setIsPrivate] = useState(board?.isPrivate || false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ویرایش اطلاعات</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <fetcher.Form
          method="POST"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-1 lg:p-2"
        >
          <Input
            icon={FolderPen}
            id="title"
            label="عنوان"
            placeholder=""
            value={boardData?.title}
            onChange={(e) =>
              setBoardData({ ...boardData, title: e.target.value })
            }
          />
          <Input
            icon={FolderPen}
            id="description"
            label="توضیحات"
            placeholder=""
            value={boardData.description}
            onChange={(e) =>
              setBoardData({ ...boardData, description: e.target.value })
            }
          />
          <Input
            icon={FolderSymlink}
            id="url"
            label="آدرس (URL)"
            placeholder=""
            prefixText="https://"
            ltr
            value={boardData.url}
            onChange={(e) =>
              setBoardData({ ...boardData, url: e.target.value })
            }
          />

          <div className="flex gap-4 items-center lg:col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm lg:text-base font-medium">
                  دسترسی خصوصی
                </span>
                <Switch
                  name="private"
                  checked={isPrivate}
                  onCheckedChange={setIsPrivate}
                />
              </div>
              <span className="text-xs lg:text-sm text-muted-foreground">
                بخش‌های عمومی برای همه قابل مشاهده‌اند، در حالی که بخش‌های خصوصی
                فقط برای اعضای داخلی نمایش داده می‌شوند.
              </span>
            </div>
          </div>

          <SubmitButton
            label="ثبت تغییرات"
            className="col-span-1 lg:col-span-2 lg:w-1/4 mt-3"
            isLoading={fetcher.state !== "idle"}
          />
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}
