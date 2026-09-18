export function getWorkspaceUrl(
  subdomain: string,
  request: Request,
  url: URL,
  path: string = "/dashboard",
): string {
  const isDevelopment = process.env.NODE_ENV === "development";

  const forwardedHost =
    request.headers.get("x-forwarded-host") || request.headers.get("host");

  const currentHost = forwardedHost || url.host;

  const protocol = isDevelopment ? url.protocol.replace(":", "") : "https";

  const [hostname, port] = currentHost.split(":");

  const portPart = isDevelopment && port ? `:${port}` : "";

  let baseDomain = hostname;

  if (!isDevelopment) {
    baseDomain = hostname
      .replace(/^www\./, "")
      .split(".")
      .slice(-2)
      .join(".");
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${protocol}://${subdomain}.${baseDomain}${portPart}${cleanPath}`;
}
