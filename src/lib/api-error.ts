import axios from "axios";

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "ApiClientError";
    this.status = options?.status;
    this.code = options?.code ?? "UNKNOWN";
  }
}

function messageFromPayload(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }
  if (Array.isArray(record.message) && record.message.length > 0) {
    return String(record.message[0]);
  }
  return null;
}

export function toApiClientError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const payloadMessage = messageFromPayload(error.response?.data);

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return new ApiClientError(
          "The request timed out. Please try again.",
          { code: "TIMEOUT", status }
        );
      }
      return new ApiClientError(
        "Unable to reach the CodeMind API. Check your network connection.",
        { code: "NETWORK", status }
      );
    }

    if (status === 401) {
      return new ApiClientError(
        payloadMessage ?? "Your session has expired. Please sign in again.",
        { code: "UNAUTHORIZED", status }
      );
    }

    if (status === 403) {
      return new ApiClientError(
        payloadMessage ?? "You do not have permission to perform this action.",
        { code: "FORBIDDEN", status }
      );
    }

    if (status === 404) {
      return new ApiClientError(
        payloadMessage ?? "The requested resource was not found.",
        { code: "NOT_FOUND", status }
      );
    }

    if (status === 409) {
      return new ApiClientError(
        payloadMessage ?? "This resource already exists.",
        { code: "CONFLICT", status }
      );
    }

    return new ApiClientError(
      payloadMessage ?? "Something went wrong. Please try again.",
      { code: "API_ERROR", status }
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message, { code: "ERROR" });
  }

  return new ApiClientError("Something went wrong. Please try again.");
}

export function getErrorMessage(error: unknown): string {
  return toApiClientError(error).message;
}

export function isUnverifiedAccountError(error: unknown): boolean {
  const apiError = toApiClientError(error);
  return (
    apiError.status === 403 &&
    /verify your email/i.test(apiError.message)
  );
}
