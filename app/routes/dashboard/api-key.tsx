import { KeyRound } from "lucide-react";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { PageHeader } from "~/components/ui/page-header";
import type { Route } from "./+types/api-key";
import { useState } from "react";
import ApiKeyDialog from "~/components/api-key/api-key-dialog.tsx";
import { ERROR_CODE } from "~/constants/errors";
import type { ApiKey } from "~/types";
import ApiKeyCard from "~/components/api-key/api-key-card";
import { SEO_CONFIG } from "~/constants/seo";
import { useActionAlert } from "~/hooks/use-action-alert";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { data, useFetcher } from "react-router";
import {
  createApiKey,
  deleteApiKey,
  getApiKeys,
  updateApiKey,
} from "~/services/api-key.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.apiKey.title }];
}

export async function loader({ context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  const pageParam = url.searchParams.get("page") || "1";

  try {
    const workspace = await getCurrentWorkspace(api);
    const { data: apiKeys, pagination } = await getApiKeys(
      api,
      workspace.id,
      pageParam,
    );

    return { apiKeys, pagination };
  } catch (error) {
    console.error("Failed to fetch apiKeys from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);
  const method = request.method;

  const formData = await request.formData();
  const keyName = formData.get("keyName") as string;
  const keyId = formData.get("keyId") as string;

  if (method !== "POST" && !keyId) {
    return createResponse({
      status: "ERR",
      message:
        MESSAGES.API_KEY[
          method === "PATCH" ? "UPDATE_ERROR" : "DELETION_ERROR"
        ],
    });
  }

  if (method === "POST" && !keyName) {
    return createResponse({
      status: "ERR",
      message: MESSAGES.VALIDATION.FIELDS.KEY.NAME_REQUIRED,
    });
  }

  try {
    const workspace = await getCurrentWorkspace(api);
    switch (method) {
      case "POST": {
        const { key } = await createApiKey(api, workspace.id, {
          name: keyName,
        });

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.API_KEY.CREATED,
          data: { api_key: key, method },
        });
      }

      case "PATCH": {
        await updateApiKey(api, workspace.id, keyId, {
          name: keyName,
        });

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.API_KEY.UPDATED,
          data: { method },
        });
      }

      case "DELETE": {
        await deleteApiKey(api, workspace.id, keyId);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.API_KEY.DELETED,
          data: { method },
        });
      }
    }
  } catch (error) {
    console.error(`API Key operation (${method}) failed:`, error);

    let errorMessage: string = MESSAGES.API_KEY.DELETION_ERROR;
    if (method === "POST") {
      errorMessage = MESSAGES.API_KEY.CREATION_ERROR;
    } else if (method === "PATCH") {
      errorMessage = MESSAGES.API_KEY.UPDATE_ERROR;
    }

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessage,
    });
  }
}

export default function ApiKey({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [keyToEdit, setKeyToEdit] = useState<ApiKey | null>(null);

  return (
    <div className="w-full flex flex-col p-3 mt-16 md:mt-0">
      <PageHeader
        icon={KeyRound}
        title="کلید API"
        description="کلیدهای API برای احراز هویت درخواست‌های وب سرویس استفاده می‌شوند. 
        هر کلید دارای سطح دسترسی مشخصی است و می‌تواند در هر زمان منقضی یا لغو شود. 
        لطفاً کلید تولید شده را در جای امنی ذخیره کنید، زیرا پس از بسته شدن صفحه دیگر نمایش داده نخواهد شد."
      />

      <div className="mt-6 w-1/3 lg:w-1/5">
        <RippleButton className="w-full" onClick={() => setDialogOpen(true)}>
          ایجاد کلید
        </RippleButton>
      </div>

      <ApiKeyCard
        apiKeys={loaderData.apiKeys}
        setKeyName={setKeyName}
        setKeyToEdit={setKeyToEdit}
        setDialogOpen={setDialogOpen}
      />

      <CustomPagination pagination={loaderData.pagination} />

      <ApiKeyDialog
        fetcher={fetcher}
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        keyName={keyName}
        setKeyName={setKeyName}
        keyToEdit={keyToEdit}
        setKeyToEdit={setKeyToEdit}
      />
    </div>
  );
}
