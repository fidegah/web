import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from "lucide-react";

export const blockTypeToBlockName: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  paragraph: { label: "پاراگراف", icon: <TextIcon className="size-4" /> },
  h1: { label: "تیتر ۱", icon: <Heading1Icon className="size-4" /> },
  h2: { label: "تیتر ۲", icon: <Heading2Icon className="size-4" /> },
  h3: { label: "تیتر ۳", icon: <Heading3Icon className="size-4" /> },
  number: {
    label: "لیست شماره‌دار",
    icon: <ListOrderedIcon className="size-4" />,
  },
  bullet: { label: "لیست گلوله‌ای", icon: <ListIcon className="size-4" /> },
  check: { label: "لیست چک‌باکس", icon: <ListTodoIcon className="size-4" /> },
  code: { label: "بلاک کد", icon: <CodeIcon className="size-4" /> },
  quote: { label: "نقل‌قول", icon: <QuoteIcon className="size-4" /> },
};
