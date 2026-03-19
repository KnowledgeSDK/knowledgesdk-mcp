export const BASE_URL =
  process.env.KNOWLEDGESDK_BASE_URL || "https://api.knowledgesdk.com";

export const hasApiKey = () => {
  return !!process.env.KNOWLEDGESDK_API_KEY;
};

export const getApiKey = (): string => {
  if (!process.env.KNOWLEDGESDK_API_KEY) {
    throw new Error(
      "KNOWLEDGESDK_API_KEY environment variable is not set. Please set it before using this tool."
    );
  }
  return process.env.KNOWLEDGESDK_API_KEY;
};

export const getHeaders = (): Record<string, string> => {
  return {
    "x-api-key": getApiKey(),
    "Content-Type": "application/json",
  };
};

export async function callApi<T = any>(
  path: string,
  body: Record<string, any>
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorBody = await response.json() as Record<string, unknown>;
      if (typeof errorBody.message === "string") {
        errorMessage = errorBody.message;
      } else if (typeof errorBody.error === "string") {
        errorMessage = errorBody.error;
      }
    } catch {
      // ignore JSON parse errors on error response
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
