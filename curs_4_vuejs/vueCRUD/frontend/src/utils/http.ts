import axios, { AxiosHeaders } from "axios";

interface HttpError extends Error {
  status?: number;
}

const REQUEST_TIMEOUT_MS = 10000;

function normalizeHeaders(
  headers?: HeadersInit,
): Record<string, string> | undefined {
  if (!headers) {
    return undefined;
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const response = await axios.request<T>({
      url,
      method: init?.method,
      headers: AxiosHeaders.from(normalizeHeaders(init?.headers)),
      data: init?.body,
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const httpError = new Error(
        error.response?.statusText || error.message || "Request failed",
      ) as HttpError;

      if (error.code === "ECONNABORTED") {
        httpError.message = "Request timed out";
        httpError.status = 408;
        throw httpError;
      }

      if (typeof error.response?.status === "number") {
        httpError.status = error.response.status;
      }

      throw httpError;
    }

    throw error;
  }
}

export function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  return request<T>(url, init);
}

export function requestVoid(url: string, init?: RequestInit): Promise<void> {
  return request<void>(url, init);
}