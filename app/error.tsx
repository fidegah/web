import { Headset, House, RotateCw } from "lucide-react";
import { Activity } from "react";
import { Link, useNavigate } from "react-router";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";

interface ErrorComponentProps {
  statusCode: "400" | "403" | "404" | "500";
  code: string;
  title: string;
  description: string;
}

export default function ErrorComponent({
  statusCode,
  code,
  title,
  description,
}: Readonly<ErrorComponentProps>) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen md:justify-center overflow-y-auto scrollbar-thin">
      <div className="w-full ltr md:absolute md:top-0 p-4">
        <img
          src="/logos/fidegah_logo_complete.webp"
          alt="Fidegah Logo"
          className="w-20 lg:w-25"
        />
      </div>

      <div className="flex md:justify-center items-center flex-col md:flex-row-reverse p-4 gap-16">
        <b className="font-['Archivo_Black'] text-9xl md:text-[140px] lg:text-[150px]">
          {statusCode}
        </b>

        <div className="flex flex-col gap-4 md:gap-6 text-center md:w-1/2">
          <b className="lg:text-xl">{title}</b>
          <p className="text-muted-foreground">{description}</p>

          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <Link to="/" className="w-full md:w-fit">
              <RippleButton variant="outline" className="text-center w-full">
                <House />
                برگشت به صفحه اصلی
              </RippleButton>
            </Link>

            <Activity mode={statusCode === "500" ? "visible" : "hidden"}>
              <RippleButton
                variant="outline"
                className="text-center"
                onClick={() => navigate(0)}
              >
                <RotateCw />
                بارگذاری مجدد
              </RippleButton>

              <a href="https://narimanfallahi.ir" target="_blank">
                <RippleButton
                  variant="secondary"
                  className="text-center w-full md:w-fit"
                  onClick={() => navigate(0)}
                >
                  <Headset />
                  ارتباط با پشتیبانی
                </RippleButton>
              </a>
            </Activity>
          </div>

          <div className="flex w-full justify-center">
            <p className="text-xs md:text-sm p-2 text-black/50 dark:text-white/80 rounded-lg md:rounded-xl backdrop-blur bg-white/10 dark:bg-black/20 border">
              code: <span className="text-black dark:text-white">{code}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
