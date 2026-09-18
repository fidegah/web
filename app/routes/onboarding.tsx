import { CheckIcon, LoaderCircleIcon, Sparkles } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { redirect, replace, useFetcher, useLoaderData } from "react-router";
import { Card, CardFooter } from "~/components/ui/card";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
} from "~/components/ui/reui/stepper";
import { useActionAlert } from "~/hooks/use-action-alert";
import { createResponse } from "~/lib/create-response";
import { getFormNumber, getZodErrorMessages } from "~/lib/utils";
import { workspaceSchema } from "~/schemas/dashboard/workspace";
import type { CreateResponse } from "~/types";
import type { Route } from "./+types/onboarding";
import Step1 from "~/components/onboarding/step-1";
import ErrorMessage from "~/components/ui/error-message";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { Spinner } from "~/components/ui/spinner";
import Step2 from "~/components/onboarding/step-2";
import { MESSAGES } from "~/constants/messages";
import Step3 from "~/components/onboarding/step-3";
import { SEO_CONFIG } from "~/constants/seo";
import { getWorkspaceUrl } from "~/lib/get-workspace-url.server";
import { invalidateWorkspacesCache } from "~/lib/cache.utils.server";
import { getCurrentUser, updateCurrentUser } from "~/services/user.service";
import { createWorkspace, getWorkspaces } from "~/services/workspace.service";
import { ApiError } from "~/lib/api/client";
import { apiClientContext } from "~/context";
import { isAuthenticated } from "~/lib/auth-utils.server";
import { authMiddleware } from "~/middleware/auth.server";

export function meta() {
  const config = SEO_CONFIG.onboarding;

  return [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: config.robots },
  ];
}

export const middleware = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const isAuth = await isAuthenticated(request);

  if (!isAuth) return redirect("/auth/login");

  const user = await getCurrentUser(api);

  if (user.onboardingMeta) return replace("/dashboard");

  const workspaces = await getWorkspaces(api);
  const hasWorkspace = workspaces && workspaces.length > 0;

  return { hasWorkspace };
}

export async function action({ request, context, url }: Route.ActionArgs) {
  const api = context.get(apiClientContext);

  const formData = await request.formData();
  const currentStepNumber = getFormNumber(formData, "current-step");

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;

  const role = formData.get("role");
  const teamSize = formData.get("teamSize");
  const expertise = formData.get("expertise");
  const usageFrequency = formData.get("usageFrequency");

  const platformType = formData.get("platformType");
  const userCount = formData.get("userCount");
  const integrationNeed = formData.get("integrationNeed");
  const priority = formData.get("priority");
  const industry = formData.get("industry");
  const revenueModel = formData.get("revenueModel");

  try {
    switch (currentStepNumber) {
      case 1: {
        const result = workspaceSchema.safeParse({
          name,
          subdomain,
        });

        if (result?.error) {
          return createResponse({
            status: "ERR",
            message: getZodErrorMessages(result.error),
          });
        }

        const existingWorkspaces = await getWorkspaces(api);

        if (!existingWorkspaces || existingWorkspaces.length === 0) {
          await createWorkspace(api, {
            name,
            subdomain,
          });
          invalidateWorkspacesCache();
        }

        return createResponse({
          status: "OK",
        });
      }

      case 2:
        if (!role || !teamSize || !expertise || !usageFrequency) {
          return createResponse({
            status: "ERR",
            message: MESSAGES.VALIDATION.FIELDS.ALL_FIELDS_REQUIRED,
          });
        }
        return createResponse({
          status: "OK",
        });

      case 3: {
        if (
          !platformType ||
          !userCount ||
          !integrationNeed ||
          !priority ||
          !industry ||
          !revenueModel
        ) {
          return createResponse({
            status: "ERR",
            message: MESSAGES.VALIDATION.FIELDS.ALL_FIELDS_REQUIRED,
          });
        }

        const incomingData: Record<string, unknown> = {
          role,
          team_size: teamSize,
          expertise,
          usage_frequency: usageFrequency,
          platform_type: platformType,
          user_count: userCount,
          integration_need: integrationNeed,
          priority,
          industry,
          revenue_model: revenueModel,
        };

        const onboardingMeta = Object.fromEntries(
          Object.entries(incomingData).filter(
            ([_, value]) =>
              value !== null && value !== undefined && value !== "",
          ),
        );

        await updateCurrentUser(api, {
          onboardingMeta,
        });

        const userWorkspaces = await getWorkspaces(api);

        if (!userWorkspaces || userWorkspaces.length === 0)
          throw new Error("No workspaces found after creation");

        const replaceUrl = getWorkspaceUrl(
          userWorkspaces[0].subdomain,
          request,
          url,
        );
        return replace(replaceUrl);
      }
    }
  } catch (error) {
    console.error(
      `Onboarding operation failed at step ${currentStepNumber}:`,
      error,
    );

    if (error instanceof ApiError && error.code === "HTTP_409") {
      return createResponse({
        status: "ERR",
        message: MESSAGES.WORKSPACE.EXISTS_ERROR,
      });
    }

    return createResponse({
      status: "ERR",
      message: MESSAGES.GENERAL.ERROR,
    });
  }
}

const steps = [
  { id: "step-workspace", title: "ساخت فضای کاری" },
  { id: "step-about-you", title: "درباره شما" },
  { id: "step-about-product", title: "درباره محصول" },
];

export default function Onboarding() {
  const { hasWorkspace } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<CreateResponse>();
  useActionAlert(fetcher.data);

  const [currentStep, setCurrentStep] = useState<number>(hasWorkspace ? 2 : 1);

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (isLoading) return;

    if (fetcher.data?.status === "OK") {
      setCurrentStep((prev) => prev + 1);
    }
  }, [fetcher.data, isLoading]);

  const showPreviousButton = hasWorkspace ? currentStep > 2 : currentStep > 1;

  const getSubmitButtonText = (index: number) => {
    if (isLoading) return "در حال ثبت اطلاعات...";
    if (index < steps.length - 1) return "بعدی";
    return "ثبت اطلاعات و رفتن به داشبورد";
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center p-4 md:p-6 flex-col"
      dir="rtl"
    >
      <fetcher.Form method="POST" className="w-full md:w-2xl lg:w-2/3">
        <div className="flex flex-col gap-2 mb-6 px-1">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-foreground">
              راه‌اندازی اولیه فیدگاه
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            لطفاً مراحل زیر را جهت راه‌اندازی و شخصی‌سازی فضای کاری اختصاصی خود
            تکمیل کنید.
          </p>
        </div>

        <input type="hidden" name="current-step" value={String(currentStep)} />

        <Stepper
          value={currentStep}
          indicators={{
            completed: <CheckIcon className="size-3.5" />,
            loading: <LoaderCircleIcon className="size-3.5 animate-spin" />,
          }}
          className="w-full"
        >
          <Card className="px-3 py-2.5 bg-background">
            <StepperNav>
              {steps.map((step, index) => (
                <StepperItem
                  key={step.id}
                  step={index + 1}
                  className="relative gap-2"
                >
                  <StepperIndicator>{index + 1}</StepperIndicator>
                  <StepperTitle>{step.title}</StepperTitle>
                  {steps.length > index + 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary md:mx-2.5" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>
          </Card>
          <StepperPanel className="text-sm">
            {steps.map((step, index) => (
              <StepperContent
                key={`${step.id}-content`}
                value={index + 1}
                className="flex items-center justify-center"
              >
                <Card className="w-full mt-6 min-h-110 max-h-110 flex flex-col relative">
                  <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                    <Activity mode={index === 0 ? "visible" : "hidden"}>
                      <Step1 />
                    </Activity>

                    <Activity mode={index === 1 ? "visible" : "hidden"}>
                      <Step2 />
                    </Activity>

                    <Activity mode={index === 2 ? "visible" : "hidden"}>
                      <Step3 />
                    </Activity>
                  </div>

                  <CardFooter className="flex flex-col gap-3">
                    <ErrorMessage data={fetcher.data} />

                    <div className="flex justify-center items-center gap-3 w-full">
                      <Activity
                        mode={
                          showPreviousButton && index === currentStep - 1
                            ? "visible"
                            : "hidden"
                        }
                      >
                        <RippleButton
                          type="button"
                          variant="ghost"
                          disableHoverScale
                          disabled={isLoading}
                          onClick={() => {
                            fetcher.reset();
                            setCurrentStep((prev) => prev - 1);
                          }}
                        >
                          قبلی
                        </RippleButton>
                      </Activity>

                      <RippleButton
                        type="submit"
                        variant="outline"
                        disableHoverScale
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-2">
                          {isLoading && <Spinner />}
                          <span>{getSubmitButtonText(index)}</span>
                        </div>
                      </RippleButton>
                    </div>
                  </CardFooter>
                </Card>
              </StepperContent>
            ))}
          </StepperPanel>
        </Stepper>
      </fetcher.Form>
    </div>
  );
}
