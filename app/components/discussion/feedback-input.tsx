import { Check, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getInitials } from "~/lib/utils";
import type { CommentActionState, User } from "~/types";
import { Spinner } from "../ui/spinner";

interface FeedbackInputProps {
  onSubmitMessage: () => void;
  messageText: string;
  setMessageText: (val: string) => void;
  isReply?: boolean;
  onCancelReply: () => void;
  isEdit: boolean;
  onCancelEdit: () => void;
  user: User | null;
  isSending: boolean;
  commentActionState: CommentActionState;
}

export default function FeedbackInput({
  messageText,
  setMessageText,
  onSubmitMessage,
  isReply,
  onCancelReply,
  isEdit,
  onCancelEdit,
  user,
  isSending,
  commentActionState,
}: Readonly<FeedbackInputProps>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputSubmitIcon = isEdit ? <Check className="lg:size-5.5" /> : <Send />;

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      const maxHeight = 72;
      textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    }
  }, [messageText]);

  useEffect(() => {
    if (isReply || isEdit) textareaRef.current?.focus();
  }, [isReply, isEdit]);

  return (
    <div className="absolute w-full bottom-0 p-3 border-t flex flex-col z-10 bg-white gap-3 dark:bg-[oklch(0.24_0_0)]">
      <AnimatePresence>
        {isReply && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            exit={{
              y: 100,
              opacity: 0,
              transition: { duration: 0.15, ease: "easeIn" },
            }}
          >
            <div className="w-full flex items-center gap-2">
              <IconButton
                icon={X}
                color={[107, 114, 128]}
                onClick={onCancelReply}
                title="لغو پاسخ"
                aria-label="لغو پاسخ به دیدگاه"
              />
              <span className="text-xs lg:text-[13.5px] text-blue-600 whitespace-nowrap dark:text-blue-500">
                در حال پاسخ به :
              </span>
              <p className="truncate text-sm p-1 bg-blue-50 rounded dark:bg-gray-800">
                {commentActionState?.mode === "replying" &&
                  commentActionState.content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-2">
        <Avatar>
          <AvatarImage src={user?.avatarUrl || undefined} />
          <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
        </Avatar>

        <textarea
          ref={textareaRef}
          rows={1}
          value={messageText}
          placeholder="دیدگاه خود را بنویسید."
          onChange={(e) => setMessageText(e.target.value)}
          className="w-full outline-none resize-none max-h-18 text-sm lg:text-base no-scrollbar"
          maxLength={3000}
        />

        {isEdit && (
          <IconButton
            icon={X}
            color={[220, 38, 38]}
            onClick={onCancelEdit}
            title="لغو ویرایش"
            aria-label="لغو ویرایش دیدگاه"
          />
        )}

        <RippleButton
          size="icon"
          variant="secondary"
          className="rounded-full text-white bg-cyan-600 hover:bg-cyan-900"
          disabled={!messageText.trim() || isSending}
          onClick={() => onSubmitMessage()}
        >
          {isSending ? <Spinner /> : inputSubmitIcon}
        </RippleButton>
      </div>
    </div>
  );
}
