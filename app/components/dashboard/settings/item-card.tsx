import { type LucideIcon, Trash2, Edit2, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Activity, useState, useEffect, useRef } from "react";
import { Input } from "~/components/ui/input";
import { Spinner } from "~/components/ui/spinner";
import { DataEmptyState } from "~/components/ui/empty-state";
import { CustomPagination } from "~/components/ui/custom-pagination";
import type { Pagination } from "~/types";
import ConfirmDialog from "~/components/ui/confirm-dialog";

interface EntityItem {
  id: string;
  name: string;
}

interface EntityListCardProps {
  listTitle: string;
  emptyMessage: string;
  icon: LucideIcon;
  items: EntityItem[];
  pagination?: Pagination | null;
  deleteLoadingId: string | null;
  onEdit?: (id: string, newName: string) => void;
  editLoadingId: string | null;
  onEditClick?: (id: string, name: string) => void;
  activeEditingId?: string | null;
  onCancelEditClick?: () => void;
  deleteConfirmDialog: {
    title: string;
    description?: string | string[];
    confirmText: string;
    onConfirm: (itemId: string) => void | Promise<void>;
  };
}

export default function SettingsItemCard({
  listTitle,
  emptyMessage,
  icon: Icon,
  items,
  pagination,
  deleteLoadingId,
  onEdit,
  editLoadingId,
  onEditClick,
  activeEditingId,
  onCancelEditClick,
  deleteConfirmDialog,
}: Readonly<EntityListCardProps>) {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValue, setEditValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartEdit = (item: EntityItem) => {
    if (onEditClick) {
      if (activeEditingId === item.id) {
        onCancelEditClick?.();
      } else {
        onEditClick(String(item.id), item.name);
      }
      return;
    }
    setEditingId(item.id);
    setEditValue(item.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSaveEdit = (id: string | number) => {
    if (onEdit)
      if (
        editValue.trim() &&
        editValue !== items.find((i) => i.id === id)?.name
      ) {
        onEdit(String(id), editValue.trim());
      }

    setEditingId(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{listTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Activity mode={items && items.length > 0 ? "visible" : "hidden"}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {items.map((item) => {
              const isEditing = editingId === item.id;
              const isExternalEditing = activeEditingId === item.id;

              const isSettingsItemLoading = editLoadingId === item.id;

              let settingsItemEditIcon = Edit2;
              if (isExternalEditing) settingsItemEditIcon = X;

              return (
                <div
                  key={item.id}
                  className="w-full border border-border bg-card hover:shadow-sm transition-all duration-200 rounded-xl p-4 flex items-center justify-between h-18"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="size-5 text-muted-foreground shrink-0" />

                    <Activity mode={isEditing ? "visible" : "hidden"}>
                      <Input
                        ref={inputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(item.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="w-full border border-input rounded-md px-2 py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:text-base"
                      />
                    </Activity>

                    <Activity mode={isEditing ? "hidden" : "visible"}>
                      <span className="text-sm lg:text-base font-medium text-foreground truncate">
                        {item.name}
                      </span>
                    </Activity>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 mr-2">
                    <Activity mode={isEditing ? "visible" : "hidden"}>
                      <>
                        <IconButton
                          icon={Check}
                          onClick={() => handleSaveEdit(item.id)}
                          title="ذخیره تغییرات"
                          aria-label={`ذخیره تغییرات ${item.name}`}
                        />
                        <IconButton
                          icon={X}
                          color={[220, 38, 38]}
                          onClick={handleCancelEdit}
                          title="لغو ویرایش"
                          aria-label="لغو ویرایش"
                        />
                      </>
                    </Activity>

                    <Activity mode={isEditing ? "hidden" : "visible"}>
                      <>
                        <IconButton
                          icon={
                            isSettingsItemLoading
                              ? Spinner
                              : settingsItemEditIcon
                          }
                          color={isExternalEditing ? [220, 38, 38] : undefined}
                          onClick={() => handleStartEdit(item)}
                          disabled={editLoadingId === item.id}
                          title={isExternalEditing ? "لغو ویرایش" : "ویرایش"}
                          aria-label={
                            isExternalEditing
                              ? `لغو ویرایش ${item.name}`
                              : `ویرایش ${item.name}`
                          }
                        />
                        <ConfirmDialog
                          title={deleteConfirmDialog.title}
                          description={deleteConfirmDialog.description}
                          confirmText={deleteConfirmDialog.confirmText}
                          onConfirm={() =>
                            deleteConfirmDialog.onConfirm(item.id)
                          }
                          isLoading={item.id === deleteLoadingId}
                        >
                          <IconButton
                            icon={Trash2}
                            color={[220, 38, 38]}
                            title="حذف"
                            aria-label={`حذف ${item.name}`}
                          />
                        </ConfirmDialog>
                      </>
                    </Activity>
                  </div>
                </div>
              );
            })}
          </div>
        </Activity>

        <CustomPagination pagination={pagination} maxVisiblePages={1} />

        <Activity mode={items.length === 0 ? "visible" : "hidden"}>
          <DataEmptyState title={emptyMessage} className="h-fit" size="sm" />
        </Activity>
      </CardContent>
    </Card>
  );
}
