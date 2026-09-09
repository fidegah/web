import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import AddTags from "~/components/dashboard/changelogs/add-tags";
import { PageHeader } from "~/components/ui/page-header";
import { data, useFetcher, useNavigate } from "react-router";
import ErrorMessage from "~/components/ui/error-message";
import SubmitButton from "~/components/ui/submit-button";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { Route } from "./+types/manage-changelogs";
import TiptapEditor from "~/components/tiptap-editor";
import { getChangelog, getChangelogTags } from "~/services/changelog.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta({ params }: Route.MetaArgs) {
  const { id } = params;
  const config = SEO_CONFIG.dashboard.changelog;
  const title = id ? config.edit.title : config.create.title;
  return [{ title: title }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { id } = params;

  try {
    const workspace = await getCurrentWorkspace(api);
    const changelogTags = await getChangelogTags(api, workspace.id);

    if (id) {
      const changelog = await getChangelog(api, workspace.id, id);

      return { isEdit: true, changelog, changelogTags };
    }

    return { isEdit: false, changelog: null, changelogTags };
  } catch (error) {
    console.error("Failed to fetch changelog from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function ManageChangelog({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const navigate = useNavigate();

  const { isEdit, changelog, changelogTags } = loaderData;

  const [editorData, setEditorData] = useState({ html: "", title: "" });
  const [selectedTags, setSelectedTags] = useState<string[]>(
    isEdit ? (changelog?.tagIds ?? []) : [],
  );

  const isLoading = fetcher.state !== "idle";

  const handleEditorChange = (htmlContent: string, title: string) => {
    setEditorData({ html: htmlContent, title: title });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", editorData.title);
    formData.append("content", editorData.html);
    selectedTags.forEach((tagId) => {
      formData.append("tag_ids", tagId.toString());
    });

    if (isEdit && changelog)
      formData.append("changelog_id", String(changelog.id));

    fetcher.submit(formData, {
      method: isEdit ? "PATCH" : "POST",
      action: "/proxy/changelogs",
    });
  };

  useEffect(() => {
    if (fetcher.state !== "idle") return;

    if (fetcher.data?.status === "OK") {
      navigate("/dashboard/changelogs");
    }
  }, [fetcher.data, fetcher.state]);

  return (
    <div className="w-full flex flex-col gap-6 p-3">
      <PageHeader
        icon={Megaphone}
        title={`${isEdit ? "ویرایش" : "ایجاد"} گزارش تغییرات`}
        description="در این بخش می‌توانید جزئیات بروزرسانی‌ها و تغییرات جدید را برای کاربران ثبت و نمایش دهید."
      />

      <AddTags
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        tags={changelogTags}
      />

      <TiptapEditor onChange={handleEditorChange} />

      <ErrorMessage data={fetcher.data} />

      <div className="w-full flex flex-col md:flex-row items-center gap-3">
        <SubmitButton
          label={`${isEdit ? "ویرایش" : "انتشار"} اطلاعیه`}
          className="lg:w-1/5"
          onClick={handleSubmit}
          isLoading={isLoading}
        />

        <RippleButton
          variant="outline"
          className="w-full md:w-1/7"
          onClick={() => navigate(-1)}
        >
          برگشت
        </RippleButton>
      </div>
    </div>
  );
}
