import SectionHeader from "../../../ui/website/public/section-header";
import { Input } from "~/components/ui/input";
import { Mail, Send } from "lucide-react";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { NEWSLETTER_CONTENT } from "~/constants/public-page/home";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import { Spinner } from "~/components/ui/spinner";

export default function Newsletter() {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <SectionHeader
        title={NEWSLETTER_CONTENT.header.title}
        description={NEWSLETTER_CONTENT.header.description}
      >
        <div className="w-full max-w-2xl mx-auto mt-6 md:mt-12">
          <div className="relative overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md p-6 md:p-8 shadow-md group">
            <div className="text-center space-y-4 relative z-10">
              <div className="mx-auto w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white">
                {NEWSLETTER_CONTENT.card.title}
              </h3>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                {NEWSLETTER_CONTENT.card.description}
              </p>
            </div>

            <fetcher.Form
              method="POST"
              action="/proxy/newsletter/subscribe"
              className="mt-6 relative z-10"
            >
              <div className="flex gap-2.5 items-center justify-center max-w-md mx-auto">
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder={NEWSLETTER_CONTENT.card.inputPlaceholder}
                  className="w-full text-right bg-white/50 dark:bg-zinc-950/30 backdrop-blur-xs border border-zinc-200/60 dark:border-zinc-800/60 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  required
                />

                <RippleButton
                  size="icon"
                  className="rounded-xl size-9 bg-blue-600 text-white hover:bg-blue-500 dark:bg-white dark:text-zinc-950 shrink-0 shadow-xs"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </RippleButton>
              </div>
            </fetcher.Form>
          </div>
        </div>
      </SectionHeader>
    </div>
  );
}
