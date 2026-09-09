import {
  INDUSTRY_OPTIONS,
  INTEGRATION_NEED_OPTIONS,
  PLATFORM_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
  REVENUE_MODEL_OPTIONS,
  USER_COUNT_OPTIONS,
} from "~/constants/onboarding";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import SelectField from "./select-field";

export default function Step3() {
  return (
    <>
      <CardHeader>
        <CardTitle className="lg:text-base flex items-center gap-2">
          درباره محصول شما 🚀
        </CardTitle>
        <CardDescription>
          لطفاً اطلاعات مربوط به محصول یا استارتاپ خود را کامل کنید تا بتوانیم
          بهترین تجربه را برای شما بسازیم.
        </CardDescription>
      </CardHeader>

      <CardContent
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-right"
        dir="rtl"
      >
        <SelectField
          label="نوع پلتفرم اصلی شما چیست؟"
          name="platformType"
          options={PLATFORM_TYPE_OPTIONS}
        />

        <SelectField
          label="تعداد کاربران فعال محصول شما حدوداً چقدر است؟"
          name="userCount"
          options={USER_COUNT_OPTIONS}
        />

        <SelectField
          label="آیا نیاز به اتصال فیدگاه به ابزارهای دیگر دارید؟"
          name="integrationNeed"
          options={INTEGRATION_NEED_OPTIONS}
        />

        <SelectField
          label="مهم‌ترین اولویت شما در انتخاب ابزار چیست؟"
          name="priority"
          options={PRIORITY_OPTIONS}
        />

        <SelectField
          label="حوزه فعالیت محصول/استارتاپ شما چیست؟"
          name="industry"
          options={INDUSTRY_OPTIONS}
        />

        <SelectField
          label="مدل درآمدی محصول شما چگونه است؟"
          name="revenueModel"
          options={REVENUE_MODEL_OPTIONS}
        />
      </CardContent>
    </>
  );
}
