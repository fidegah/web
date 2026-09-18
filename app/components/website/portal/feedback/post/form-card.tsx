import { Pencil } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import ErrorMessage from "~/components/ui/error-message";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import { useActionAlert } from "~/hooks/use-action-alert";
import Textarea from "~/components/ui/textarea";
import { useEffect } from "react";
import type { CreateResponse, Post } from "~/types";

interface PortalPostFormCardProps {
  boardId: string;
  sessionId?: string;
  sdkToken?: string;
}

export default function PortalPostFormCard({
  boardId,
  sessionId,
  sdkToken,
}: Readonly<PortalPostFormCardProps>) {
  const fetcher = useFetcher<CreateResponse<Post>>();
  useActionAlert(fetcher.data);
  const navigate = useNavigate();

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (isLoading) return;
    const fetcherData = fetcher.data as CreateResponse<Post>;

    if (fetcherData?.status === "OK") {
      if (sessionId && sdkToken) {
        navigate(
          `post/${fetcherData.data?.id}?sessionId=${sessionId}&sdkToken=${sdkToken}`,
        );
      } else {
        navigate(`post/${fetcherData.data?.id}`);
      }
    }
  }, [fetcher.data, isLoading, sessionId, navigate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ایجاد پست جدید</CardTitle>
      </CardHeader>

      <CardContent>
        <fetcher.Form
          method="POST"
          action="/proxy/posts"
          className="grid grid-cols-1 gap-6"
        >
          <Input
            icon={Pencil}
            label="عنوان"
            id="title"
            name="title"
            placeholder="عنوان پست را وارد نمایید."
          />

          <div className="flex flex-col gap-3">
            <Textarea
              label="توضیحات"
              name="description"
              id="description"
              rows={4}
              placeholder="توضیحات پست را وارد نمایید."
            />

            <input type="hidden" name="boardId" value={String(boardId)} />
            <input type="hidden" name="isPortal" value="true" />
            {sessionId && sdkToken && (
              <>
                <input type="hidden" name="sessionId" value={sessionId} />
                <input type="hidden" name="sdkToken" value={sdkToken} />
              </>
            )}

            <ErrorMessage data={fetcher.data} />

            <SubmitButton
              label="ایجاد پست"
              className="mt-2 lg:w-1/4"
              isLoading={isLoading}
            />
          </div>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}
