import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Activity, type Dispatch, type SetStateAction } from "react";
import { Badge } from "~/components/ui/badge";
import type { ApiKey } from "~/types";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import { Pen, Trash } from "lucide-react";
import ConfirmDialog from "../ui/confirm-dialog";
import { useFetcher } from "react-router";

dayjs.extend(jalaliday);

const getStatusBadge = (isActive: boolean) => {
  return isActive ? (
    <Badge className="bg-green-500 hover:bg-green-600">فعال</Badge>
  ) : (
    <Badge variant="destructive">غیرفعال</Badge>
  );
};

interface ApiKeyCardProps {
  apiKeys: ApiKey[];
  setKeyToEdit: Dispatch<SetStateAction<ApiKey | null>>;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  setKeyName: Dispatch<SetStateAction<string>>;
}

export default function ApiKeyCard({
  apiKeys,
  setKeyName,
  setKeyToEdit,
  setDialogOpen,
}: Readonly<ApiKeyCardProps>) {
  const fetcher = useFetcher();

  const handleDeleteApiKey = async (keyId: number) => {
    if (!keyId) return;

    const formData = new FormData();
    formData.append("keyId", String(keyId));

    fetcher.submit(formData, {
      method: "DELETE",
    });
  };

  return (
    <Card className="w-full mt-6">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام کلید</TableHead>
              <TableHead>تاریخ ایجاد</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>آخرین استفاده</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Activity mode={apiKeys.length === 0 ? "visible" : "hidden"}>
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  هنوز کلیدی ساخته نشده است
                </TableCell>
              </TableRow>
            </Activity>

            <Activity mode={apiKeys.length > 0 ? "visible" : "hidden"}>
              {apiKeys.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-medium">
                    {dayjs(item.createdAt)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {getStatusBadge(item.isActive)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {dayjs(item.lastUsedAt)
                      .calendar("jalali")
                      .locale("fa")
                      .format("YYYY/MM/DD")}
                  </TableCell>

                  <TableCell className="flex gap-3 justify-end">
                    <ConfirmDialog
                      title={`آیا از حذف کلید ${item.name} اطمینان دارید؟`}
                      description=" ⚠️ پس از حذف، تمام درخواست‌هایی که از این کلید استفاده می‌کنند با خطا مواجه خواهند شد و این عمل قابل بازگشت نیست."
                      confirmText="حذف کلید 🗑️"
                      onConfirm={() => handleDeleteApiKey(item.id)}
                      isLoading={
                        fetcher.state !== "idle" &&
                        fetcher.formMethod === "DELETE"
                      }
                    >
                      <IconButton
                        icon={Trash}
                        color={[220, 38, 38]}
                        title="حذف کلید"
                        aria-label={`حذف کلید ${item.name}`}
                      />
                    </ConfirmDialog>

                    <IconButton
                      icon={Pen}
                      onClick={() => {
                        setKeyToEdit(item);
                        setDialogOpen(true);
                        setKeyName(item.name);
                      }}
                      title="ویرایش کلید"
                      aria-label={`ویرایش کلید ${item.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Activity>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
