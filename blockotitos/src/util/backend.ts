const envBaseUrl = import.meta.env.VITE_BACKEND_URL;
// URL de producción en Google Cloud Run
const PRODUCTION_BACKEND_URL = "https://commitspre-243000873240.us-central1.run.app";
// Fallback: usar producción en producción, localhost solo en desarrollo
const fallbackUrl = import.meta.env.PROD ? PRODUCTION_BACKEND_URL : "http://localhost:4000";
const backendBaseUrl = (envBaseUrl || fallbackUrl).replace(/\/$/, "");

// Log de depuración
if (import.meta.env.DEV) {
  console.log("[Backend] URL configurada:", backendBaseUrl);
  console.log("[Backend] Variable de entorno VITE_BACKEND_URL:", envBaseUrl || "(no configurada, usando fallback)");
} else if (import.meta.env.PROD && !envBaseUrl) {
  console.warn("[Backend] VITE_BACKEND_URL no configurada en producción, usando URL por defecto:", backendBaseUrl);
}

const defaultHeaders = {
  "Content-Type": "application/json",
};

const maxAttempts = Math.max(
  1,
  Number(import.meta.env.VITE_BACKEND_MAX_ATTEMPTS ?? 3),
);
const retryBackoffMs = Math.max(
  0,
  Number(import.meta.env.VITE_BACKEND_RETRY_BACKOFF_MS ?? 400),
);
const requestTimeoutMs = Math.max(
  0,
  Number(import.meta.env.VITE_BACKEND_TIMEOUT_MS ?? 15000),
);
const retryableStatusCodes = new Set([408, 425, 429, 500, 502, 503, 504]);
const canUseAbortController = typeof AbortController !== "undefined";

function delay(ms: number) {
  if (ms <= 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return retryableStatusCodes.has(status);
}

function isAbortError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: string }).name === "AbortError"
  );
}

function isRetryableError(error: unknown) {
  return error instanceof TypeError || isAbortError(error);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const body = options.body;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  let attempt = 1;
  let lastError: unknown;

  while (attempt <= maxAttempts) {
    const headers = {
      ...(isFormData ? {} : defaultHeaders),
      ...(options.headers || {}),
    };

    let controller: AbortController | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const shouldTimeout = requestTimeoutMs > 0 && !options.signal;

    if (shouldTimeout && canUseAbortController) {
      controller = new AbortController();
      timeoutId = setTimeout(() => controller?.abort(), requestTimeoutMs);
    }

    try {
      const fullUrl = `${backendBaseUrl}${path}`;
      if (import.meta.env.DEV) {
        console.log(`[Backend] Intento ${attempt}/${maxAttempts}: ${fullUrl}`);
      }
      
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller?.signal ?? options.signal,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const message = errorPayload?.error || response.statusText;

        if (isRetryableStatus(response.status) && attempt < maxAttempts) {
          await delay(retryBackoffMs * attempt);
          attempt += 1;
          continue;
        }

        throw new Error(message);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      
      // Detectar errores específicos de conexión
      if (isAbortError(error)) {
        const isLocalhost = backendBaseUrl.includes("localhost") || backendBaseUrl.includes("127.0.0.1");
        const errorMessage = isLocalhost
          ? `No se pudo conectar al backend. La URL configurada es ${backendBaseUrl}, pero parece que estás en producción. Por favor, configura la variable de entorno VITE_BACKEND_URL en Vercel con la URL de tu backend en Google Cloud.`
          : `La petición al backend (${backendBaseUrl}) fue cancelada por timeout. Verifica que el backend esté funcionando y accesible.`;
        throw new Error(errorMessage);
      }
      
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const isLocalhost = backendBaseUrl.includes("localhost") || backendBaseUrl.includes("127.0.0.1");
        const errorMessage = isLocalhost
          ? `No se pudo conectar al backend en ${backendBaseUrl}. En producción, configura VITE_BACKEND_URL en Vercel con la URL de tu backend en Google Cloud.`
          : `No se pudo conectar al backend en ${backendBaseUrl}. Verifica que el backend esté funcionando y que la URL sea correcta.`;
        throw new Error(errorMessage);
      }
      
      if (!isRetryableError(error) || attempt >= maxAttempts) {
        throw error instanceof Error
          ? error
          : new Error("Backend request failed");
      }

      await delay(retryBackoffMs * attempt);
      attempt += 1;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  if (isAbortError(lastError)) {
    const isLocalhost = backendBaseUrl.includes("localhost") || backendBaseUrl.includes("127.0.0.1");
    const errorMessage = isLocalhost
      ? `No se pudo conectar al backend después de ${maxAttempts} intentos. La URL configurada es ${backendBaseUrl}, pero parece que estás en producción. Por favor, configura la variable de entorno VITE_BACKEND_URL en Vercel con la URL de tu backend en Google Cloud.`
      : `La petición al backend (${backendBaseUrl}) fue cancelada después de ${maxAttempts} intentos. Verifica que el backend esté funcionando y accesible.`;
    throw new Error(errorMessage);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Backend request failed");
}

export interface CreateEventPayload {
  creator: string;
  eventName: string;
  eventDate: number;
  location: string;
  description: string;
  maxPoaps: number;
  claimStart: number;
  claimEnd: number;
  metadataUri: string;
  imageUrl?: string;
  imageFile?: File | null;
}

export interface ClaimEventPayload {
  claimer: string;
  eventId: number;
  payerSecret?: string;
}

export interface BackendTxResponse {
  txHash: string;
  signedEnvelope: string;
  rpcResponse?: Record<string, unknown>;
}

export interface CreateEventResponse extends BackendTxResponse {
  eventId?: number;
  imageUrl?: string;
}

export function createEventRequest(payload: CreateEventPayload) {
  const formData = new FormData();
  formData.append("creator", payload.creator);
  formData.append("eventName", payload.eventName);
  formData.append("eventDate", payload.eventDate.toString());
  formData.append("location", payload.location);
  formData.append("description", payload.description);
  formData.append("maxPoaps", payload.maxPoaps.toString());
  formData.append("claimStart", payload.claimStart.toString());
  formData.append("claimEnd", payload.claimEnd.toString());
  formData.append("metadataUri", payload.metadataUri);
  if (typeof payload.imageUrl === "string") {
    formData.append("imageUrl", payload.imageUrl);
  }
  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }
  return request<CreateEventResponse>("/events/create", {
    method: "POST",
    body: formData,
  });
}

export function claimEventRequest(payload: ClaimEventPayload) {
  return request<BackendTxResponse>("/events/claim", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getBackendBaseUrl() {
  return backendBaseUrl;
}

// Función de utilidad para verificar la conexión con el backend
export async function checkBackendConnection(): Promise<{ connected: boolean; url: string; error?: string }> {
  try {
    const response = await fetch(`${backendBaseUrl}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000), // 5 segundos de timeout para el health check
    });
    
    if (response.ok) {
      return { connected: true, url: backendBaseUrl };
    } else {
      return { 
        connected: false, 
        url: backendBaseUrl, 
        error: `Backend respondió con status ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      connected: false, 
      url: backendBaseUrl, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

export async function fetchMintedCount(eventId: number) {
  return request<{ mintedCount: number }>(`/events/${eventId}/minted-count`);
}

export interface OnchainEventSummary {
  eventId: number;
  name: string;
  date: number;
  location: string;
  description: string;
  maxSpots: number;
  claimStart: number;
  claimEnd: number;
  metadataUri?: string;
  imageUrl: string;
  creator: string;
  mintedCount: number;
  tokenId?: number;
}

export interface FetchOnchainEventsOptions {
  creator?: string;
  signal?: AbortSignal;
}

type FetchOnchainEventsArg = string | FetchOnchainEventsOptions | undefined;

export async function fetchOnchainEvents(arg?: FetchOnchainEventsArg) {
  let creator: string | undefined;
  let signal: AbortSignal | undefined;

  if (typeof arg === "string") {
    creator = arg;
  } else if (typeof arg === "object" && arg !== null) {
    creator = arg.creator;
    signal = arg.signal;
  }

  const query = new URLSearchParams();
  if (creator) {
    query.set("creator", creator);
  }

  const queryString = query.toString();
  const path = queryString ? `/events/onchain?${queryString}` : "/events/onchain";

  const response = await request<{ events: OnchainEventSummary[] }>(
    path,
    signal ? { signal } : undefined,
  );
  return response.events;
}

export type ClaimedEventSummary = OnchainEventSummary;

export async function fetchClaimedEventsByClaimer(
  claimer: string,
  signal?: AbortSignal,
) {
  if (!claimer) {
    throw new Error("claimer is required");
  }
  const response = await request<{ events: ClaimedEventSummary[] }>(
    `/claimers/${encodeURIComponent(claimer)}/events`,
    signal ? { signal } : undefined,
  );
  return response.events;
}


