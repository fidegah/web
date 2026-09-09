import { data } from "react-router";
import type { CreateResponse } from "~/types";

interface CreateResponseOptions extends CreateResponse {
  headers?: HeadersInit;
  statusCode?: number;
}

export function createResponse({
  message,
  showAlert = false,
  status,
  description,
  data: responseData,
  headers,
  statusCode = status === "OK" ? 200 : 400,
}: CreateResponseOptions) {
  return data(
    {
      status,
      showAlert,
      message,
      description,
      data: responseData,
    },
    {
      status: statusCode,
      headers,
    },
  );
}
