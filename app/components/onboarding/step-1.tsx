import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CreateWorkspaceFields from "../craete-workspace-fields";

export default function Step1() {
  return (
    <>
      <CardHeader>
        <CardTitle className="lg:text-base">
          بیایید اولین فضای کاری‌تان را بسازیم! ✨
        </CardTitle>
        <CardDescription>
          اینجا مرکز فرماندهی شما برای مدیریت بازخوردها، اولویت‌بندی ویژگی‌ها و
          هماهنگی با تیم است. با انتخاب نام و آدرس ساب‌دامین خانه جدید محصول خود
          را راه‌اندازی کنید.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 mt-6">
        <CreateWorkspaceFields />
      </CardContent>
    </>
  );
}
