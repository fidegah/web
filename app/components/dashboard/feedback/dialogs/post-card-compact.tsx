import { Activity } from "react";
import FeedbackPostDetail from "../post-detail";
import { useSearchParams } from "react-router";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import type {
  Board,
  Post,
  PostComment,
  PostStatus,
  PostVoter,
  User,
  Tag,
  Workspace,
  PostCategory,
  WorkspaceRole,
  Paginated,
  PostDetailData,
} from "~/types";

interface PostCardDialogsMobileProps {
  activeView: "chat" | "info" | null;
  setActiveView: (view: "chat" | "info" | null) => void;
  data: PostDetailData;
}

export default function PostCardDialogsCompact({
  activeView,
  setActiveView,
  data,
}: Readonly<PostCardDialogsMobileProps>) {
  const [_, setSearchParams] = useSearchParams();

  const handleClose = () => {
    setActiveView(null);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("open-dialog");
      return newParams;
    });
  };

  return (
    <Dialog open={activeView !== null}>
      <DialogContent showCloseButton={false}>
        <Activity mode={activeView === "chat" ? "visible" : "hidden"}>
          <FeedbackPostDetail
            backBtnOnClick={handleClose}
            infoBtnOnClick={() => setActiveView("info")}
            isShowPostCardInfo={false}
            data={data}
          />
        </Activity>

        <Activity mode={activeView === "info" ? "visible" : "hidden"}>
          <div className="flex h-screen w-full overflow-hidden">
            <FeedbackPostDetail
              isShowChat={false}
              isShowPostCardInfo
              backBtnOnClick={() => setActiveView("chat")}
              data={data}
            />
          </div>
        </Activity>
      </DialogContent>
    </Dialog>
  );
}
