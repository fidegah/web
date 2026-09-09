import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRevalidator } from "react-router";
import { Button } from "./button";
import { Spinner } from "./spinner";

interface ErrorPageProps {
  title?: string;
  message?: string;
}

export default function ErrorPage({
  title = "اوه نه! یه مشکلی پیش اومد 😢",
  message = "به نظر میاد چیزی خراب شده… دوباره تلاش می‌کنیم، نگران نباش!",
}: Readonly<ErrorPageProps>) {
  const revalidator = useRevalidator();
  const isLoading = revalidator.state === "loading";

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 p-6 text-center bg-background rounded-lg">
      <AlertCircle className="w-16 h-16 text-red-500 animate-bounce" />
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>

      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={revalidator.revalidate}
      >
        {isLoading ? <Spinner /> : <RefreshCw />}
        تلاش دوباره
      </Button>
    </div>
  );
}
