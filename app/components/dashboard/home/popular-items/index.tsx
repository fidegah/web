import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import HomeFilterSelect from "../filter-select";
import { TIME_RANGES } from "~/constants/time-ranges";
import PopularItemCard from "./item-card";
import type { HomePopularItems } from "~/types";
import {
  ChevronUp,
  GalleryVerticalEnd,
  Globe,
  Layers,
  Lock,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Activity } from "react";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";

dayjs.extend(jalaliday);
dayjs.calendar("jalali");
dayjs.locale("fa");

interface PopularItemsProps {
  data: HomePopularItems;
}

export default function PopularItems({ data }: Readonly<PopularItemsProps>) {
  const timeSearchParamKey = "popular-items-time-range";
  const { timeRange, period, limit, boards, posts, categories, tags } =
    data ?? {};

  const postsItems =
    posts?.items?.map((post, index) => ({
      id: post.id,
      rank: index + 1,
      title: post.title,
      score: post.popularityScore,
      infoItems: [
        {
          icon: <GalleryVerticalEnd className="size-4" />,
          label: post.boardName,
        },
        {
          icon: <Tag className="size-4" />,
          label: post.categoryName,
        },
        {
          icon: <ChevronUp className="size-4 text-green-500" />,
          label: "رأی",
          value: post.votesCount,
        },
        {
          icon: <MessageCircle className="size-4 text-blue-500" />,
          label: "نظر",
          value: post.commentsCount,
        },
      ],
    })) ?? [];

  const boardsItems =
    boards?.items?.map((board, index) => ({
      id: board.id,
      rank: index + 1,
      title: board.title,
      score: board.popularityScore,
      infoItems: [
        {
          icon: <MessageCircle className="size-4" />,
          label: "پست",
          value: board.postsCount,
        },
        {
          icon: board.isPrivate ? (
            <Lock className="size-4" />
          ) : (
            <Globe className="size-4" />
          ),
          label: board.isPrivate ? "خصوصی" : "عمومی",
        },
      ],
    })) ?? [];

  const categoriesItems =
    categories?.items?.map((category, index) => ({
      id: category.id,
      rank: index + 1,
      title: category.name,
      score: category.popularityScore,
      infoItems: [
        {
          icon: <MessageCircle className="size-4" />,
          label: "پست",
          value: category.postsCount,
        },
        {
          icon: <Layers className="size-4" />,
          label: "بخش",
          value: category.boardCount,
        },
      ],
    })) ?? [];

  const tagsItems =
    tags?.items?.map((tag, index) => ({
      id: tag.id,
      rank: index + 1,
      title: tag.name,
      score: tag.popularityScore || 0,
      infoItems: [
        {
          icon: <MessageCircle className="size-4" />,
          label: "پست",
          value: tag.postsCount,
        },
        {
          icon: <Layers className="size-4" />,
          label: "بخش",
          value: tag.boardCount,
        },
      ],
    })) ?? [];

  const startDateText = period?.start
    ? dayjs(period.start).format("YYYY/MM/DD")
    : "---";
  const endDateText = period?.end
    ? dayjs(period.end).format("YYYY/MM/DD")
    : "---";

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>محبوب ترین ها</CardTitle>
          <HomeFilterSelect
            label="بازه های زمانی"
            item={TIME_RANGES}
            defaultValue={timeRange}
            searchParamKey={timeSearchParamKey}
          />
        </div>

        <CardDescription>
          نگاهی به محبوب‌ترین پست‌ها، بخش‌ها، دسته‌بندی‌ها و تگ‌ها (حداکثر{" "}
          {limit ?? 0} مورد برای هرکدام).
        </CardDescription>

        <CardDescription>
          اطلاعات، بازه زمانی {startDateText} تا {endDateText} نمایش داده میشود.
        </CardDescription>

        <CardDescription>
          <span className="font-bold">توجه:</span>
          <span>
            {" "}
            امتیازها بر اساس الگوریتم‌های پیشرفته و با در نظر گرفتن سلیقه و
            تعاملات کاربران محاسبه شده‌اند.
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 lg:gap-6">
        <PopularItemCard
          title="پست‌های داغ"
          items={postsItems}
          itemCount={posts?.total ?? 0}
        />

        <PopularItemCard
          title="بخش‌های محبوب"
          items={boardsItems}
          itemCount={boards?.total ?? 0}
        />

        <PopularItemCard
          title="دسته‌بندی‌های محبوب"
          items={categoriesItems}
          itemCount={categories?.total ?? 0}
        />

        <Activity mode={(tags?.total ?? 0) > 0 ? "visible" : "hidden"}>
          <PopularItemCard
            title="تگ‌های محبوب"
            items={tagsItems}
            itemCount={tags?.total ?? 0}
          />
        </Activity>
      </CardContent>
    </Card>
  );
}
