import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { AlertProvider } from "./components/alert-context";
import { LoadingBarContainer } from "react-top-loading-bar";
import LoadingBarComponent from "./components/loading-bar";
import ErrorComponent from "./error";
import { ERROR_MESSAGE } from "./constants/errors";
import { TooltipProvider } from "./components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
  },
  {
    rel: "icon",
    href: "/favicon.ico",
    type: "image/x-icon",
  },
];

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0f172a"
        />
        <meta name="robots" content="index, follow" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (() => {
        try {
          const theme = localStorage.getItem('theme');
          if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      })();
    `,
          }}
        />
      </head>
      <body>
        <LoadingBarContainer>
          <LoadingBarComponent />
          <AlertProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AlertProvider>
        </LoadingBarContainer>
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <ErrorComponent
          statusCode="400"
          code={error.statusText}
          title={ERROR_MESSAGE[400].title}
          description={ERROR_MESSAGE[400].description}
        />
      );
    }

    if (error.status === 404)
      return (
        <ErrorComponent
          statusCode="404"
          code={error.statusText}
          title={ERROR_MESSAGE[404].title}
          description={ERROR_MESSAGE[404].description}
        />
      );

    if (error.status === 403)
      return (
        <ErrorComponent
          statusCode="403"
          code={error.statusText}
          title={ERROR_MESSAGE[403].title}
          description={ERROR_MESSAGE[403].description}
        />
      );

    if (error.status === 500)
      return (
        <ErrorComponent
          statusCode="500"
          code={error.statusText}
          title={ERROR_MESSAGE[500].title}
          description={ERROR_MESSAGE[500].description}
        />
      );
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
