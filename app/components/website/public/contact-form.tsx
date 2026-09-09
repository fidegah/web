import { useFetcher } from "react-router";
import ErrorMessage from "~/components/ui/error-message";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import Textarea from "~/components/ui/textarea";

export default function ContactForm() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="POST"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <Input
        label="نام کامل"
        id="name"
        name="name"
        placeholder="مثال: نریمان فلاحی"
      />

      <Input
        label="ایمیل"
        id="email"
        name="email"
        placeholder="مثال: test@gmail.com"
      />

      <div className="md:col-span-2">
        <Input
          label="موضوع"
          id="subject"
          name="subject"
          placeholder="موضوع پیام خود را وارد نمایید."
        />
      </div>

      <div className="md:col-span-2">
        <Textarea
          id="message"
          label="متن پیام"
          name="message"
          placeholder="متن پیام خود را به صورت کامل بنویسید."
          className="min-h-30"
        />
      </div>

      <div className="md:col-span-2">
        <ErrorMessage data={fetcher.data} />
      </div>

      <div className="md:col-span-2 flex mt-2">
        <SubmitButton
          label="ارسال پیام"
          isLoading={fetcher.state !== "idle"}
          className="w-full lg:w-1/3"
        />
      </div>
    </fetcher.Form>
  );
}
