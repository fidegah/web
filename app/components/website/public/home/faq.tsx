import { useId } from "react";
import SectionHeader from "../../../ui/website/public/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { FAQ_SECTION } from "~/constants/public-page/home";

export default function Faq() {
  const accordionId = useId();

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <SectionHeader
        title={FAQ_SECTION.header.title}
        description={FAQ_SECTION.header.description}
      >
        <div className="w-full max-w-3xl mx-auto mt-6 md:mt-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQ_SECTION.items.map((item, index) => {
              const itemValue = `${accordionId}-item-${index}`;

              return (
                <AccordionItem
                  key={itemValue}
                  value={itemValue}
                  className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md px-5 py-1 transition-all duration-300 hover:border-blue-500/30 dark:hover:border-blue-500/20 data-[state=open]:border-blue-500/40 data-[state=open]:bg-white dark:data-[state=open]:bg-zinc-950 data-[state=open]:shadow-lg data-[state=open]:shadow-blue-500/5 group"
                >
                  <AccordionTrigger className="text-right hover:no-underline py-4">
                    <div className="flex items-center gap-3 w-full">
                      <HelpCircle className="size-5 text-zinc-400 dark:text-zinc-600 group-data-[state=open]:text-blue-500 transition-colors duration-300 shrink-0" />
                      <span className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200 group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400 lg:text-base transition-colors duration-300">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400 pr-8 pl-4 text-sm leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </SectionHeader>
    </div>
  );
}
