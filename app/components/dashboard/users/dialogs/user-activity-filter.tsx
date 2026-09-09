import FilterSection from "../../filters/ filter-section";
import FilterDialog from "../../filters/filter-dialog";

interface UsersFilterDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const activity = [
  { id: "1", label: "پست ها", value: "posted" },
  { id: "2", label: "دیدگاه ها", value: "commented" },
  { id: "3", label: "رأی ها", value: "voted" },
];

export default function UserActivityFilterDialog({
  isOpen,
  setIsOpen,
}: Readonly<UsersFilterDialogProps>) {
  return (
    <FilterDialog isLoading={false} isOpen={isOpen} setIsOpen={setIsOpen}>
      <FilterSection title="فعالیت" items={activity} paramName="activity" />
    </FilterDialog>
  );
}
