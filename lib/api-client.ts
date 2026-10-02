const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type ApiEnvelope<T> = { success: true; data: T } | { success: false; message: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Something went wrong. Please check your connection and try again.");
  }

  let body: ApiEnvelope<T> | null = null;
  try {
    body = await response.json();
  } catch {
    // no JSON body (e.g. empty 204) — fall through to status-based handling below
  }

  if (!response.ok || !body?.success) {
    const message = body && !body.success ? body.message : "Something went wrong. Please try again.";
    throw new ApiError(response.status, message);
  }

  return body.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
};
