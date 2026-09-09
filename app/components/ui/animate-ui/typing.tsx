"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { getStrictContext } from "~/lib/get-strict-context";
import { useIsInView, type UseIsInViewOptions } from "~/hooks/use-is-in-view";

type TypingTextContextType = {
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
};

const [TypingTextProvider, useTypingText] =
  getStrictContext<TypingTextContextType>("TypingTextContext");

type TypingTextProps = React.ComponentProps<"span"> & {
  duration?: number;
  delay?: number;
  loop?: boolean;
  holdDelay?: number;
  text: string | string[];
} & UseIsInViewOptions;

function TypingText({
  ref,
  children,
  duration = 50,
  delay = 0,
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  loop = false,
  holdDelay = 1000,
  text,
  ...props
}: TypingTextProps) {
  const { ref: localRef, isInView } = useIsInView(
    ref as React.Ref<HTMLElement>,
    {
      inView,
      inViewOnce,
      inViewMargin,
    },
  );

  const [isTyping, setIsTyping] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [displayedText, setDisplayedText] = React.useState<string>("");

  const timeoutIdsRef = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const contextValue = React.useMemo(
    () => ({ isTyping, setIsTyping }),
    [isTyping],
  );

  React.useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, delay]);

  const typeText = React.useCallback(
    (str: string, onComplete: () => void) => {
      setIsTyping(true);
      let currentIndex = 0;

      const type = () => {
        if (currentIndex <= str.length) {
          setDisplayedText(str.substring(0, currentIndex));
          currentIndex++;
          const id = setTimeout(type, duration);
          timeoutIdsRef.current.push(id);
        } else {
          setIsTyping(false);
          onComplete();
        }
      };
      type();
    },
    [duration],
  );

  const eraseText = React.useCallback(
    (str: string, onComplete: () => void) => {
      setIsTyping(true);
      let currentIndex = str.length;

      const erase = () => {
        if (currentIndex >= 0) {
          setDisplayedText(str.substring(0, currentIndex));
          currentIndex--;
          const id = setTimeout(erase, duration);
          timeoutIdsRef.current.push(id);
        } else {
          setIsTyping(false);
          onComplete();
        }
      };
      erase();
    },
    [duration],
  );

  const handleAnimationStep = React.useCallback(
    (index: number, texts: string[]) => {
      const currentText = texts[index] ?? "";
      const isLast = index === texts.length - 1;

      const handleEraseComplete = () => {
        const nextIndex = isLast ? 0 : index + 1;
        handleAnimationStep(nextIndex, texts);
      };

      const startErasing = () => {
        eraseText(currentText, handleEraseComplete);
      };

      const handleTypeComplete = () => {
        if (isLast && !loop) return;
        const id = setTimeout(startErasing, holdDelay);
        timeoutIdsRef.current.push(id);
      };

      typeText(currentText, handleTypeComplete);
    },
    [loop, holdDelay, typeText, eraseText],
  );

  React.useEffect(() => {
    if (!started) return;

    const texts: string[] = typeof text === "string" ? [text] : text;
    handleAnimationStep(0, texts);

    return () => {
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, [started, text, handleAnimationStep]);

  return (
    <TypingTextProvider value={contextValue}>
      <span ref={localRef} data-slot="typing-text" {...props}>
        <motion.span>{displayedText}</motion.span>
        {children}
      </span>
    </TypingTextProvider>
  );
}

type TypingTextCursorProps = Omit<HTMLMotionProps<"span">, "children">;

function TypingTextCursor({
  style,
  variants,
  ...props
}: TypingTextCursorProps) {
  const { isTyping } = useTypingText();

  return (
    <motion.span
      data-slot="typing-text-cursor"
      variants={{
        blinking: {
          opacity: [0, 0, 1, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "linear",
            times: [0, 0.5, 0.5, 1],
          },
        },
        visible: {
          opacity: 1,
        },
        ...variants,
      }}
      animate={isTyping ? "visible" : "blinking"}
      style={{
        display: "inline-block",
        height: "16px",
        transform: "translateY(2px)",
        width: "1px",
        backgroundColor: "currentColor",
        ...style,
      }}
      {...props}
    />
  );
}

export {
  TypingText,
  TypingTextCursor,
  type TypingTextProps,
  type TypingTextCursorProps,
};
