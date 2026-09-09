import FilterSection from "../dashboard/filters/ filter-section";
import FilterDialog from "../dashboard/filters/filter-dialog";

interface PollsFilterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PollsFilter({
  isOpen,
  setIsOpen,
}: Readonly<PollsFilterProps>) {
  return (
    <FilterDialog isLoading={false} isOpen={isOpen} setIsOpen={setIsOpen}>
      <FilterSection
        title="وضعیت"
        items={[
          { id: "1", label: "فعال", value: "active" },
          { id: "2", label: "پایان یافته", value: "ended" },
          { id: "3", label: "شروع نشده", value: "not_started" },
        ]}
        paramName="status"
      />
    </FilterDialog>
  );
}
