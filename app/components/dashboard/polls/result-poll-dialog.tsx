import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Poll } from "~/types";

interface ResultPollDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  poll: Poll;
}

export default function ResultPollDialog({
  isOpen,
  setIsOpen,
  poll,
}: Readonly<ResultPollDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>توزیع آراء</DialogTitle>
          <DialogDescription>نمایش تعداد رأی‌ها تا این لحظه</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {poll.options.map((item) => (
            <div key={item.id} className="flex flex-col">
              <p className="text-muted-foreground text-sm">{item.title}</p>
              <div className="flex items-center ltr gap-2">
                <span className="text-sm">{item.percentage}%</span>
                <div
                  style={{
                    width:
                      item.percentage === 0 ? "8px" : `${item.percentage}%`,
                  }}
                  className="h-2 rounded-full bg-blue-500"
                ></div>
              </div>
            </div>
          ))}

          <span className="text-sm text-center mt-2">{`${poll.totalVotes} رأی‌`}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
