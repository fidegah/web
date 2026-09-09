import {
  EXPERTISE_OPTIONS,
  ROLE_OPTIONS,
  TEAM_SIZE_OPTIONS,
  USAGE_FREQUENCY_OPTIONS,
} from "~/constants/onboarding";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import SelectField from "./select-field";

export default function Step2() {
  return (
    <>
      <CardHeader>
        <CardTitle className="lg:text-base flex items-center gap-2">
          کمی بیشتر با شما آشنا شویم! 🤝
        </CardTitle>
        <CardDescription>
          چند سوال کوتاه درباره شما و تیم‌تان تا فیدگاه رو دقیقاً برای خودتان
          بچینیم.
        </CardDescription>
      </CardHeader>

      <CardContent
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-right"
        dir="rtl"
      >
        <SelectField
          label="نقش شما در محصول / سازمان"
          name="role"
          options={ROLE_OPTIONS}
        />

        <SelectField
          label="تعداد اعضای تیم شما"
          name="teamSize"
          options={TEAM_SIZE_OPTIONS}
          placeholder="تعداد را انتخاب کنید..."
        />

        <SelectField
          label="حوزه تخصصی شما"
          name="expertise"
          options={EXPERTISE_OPTIONS}
        />

        <SelectField
          label="هر چند وقت یکبار از پلتفرم‌های مشابه استفاده می‌کنید؟"
          name="usageFrequency"
          options={USAGE_FREQUENCY_OPTIONS}
        />
      </CardContent>
    </>
  );
}
