const envBaseUrl = import.meta.env.VITE_BACKEND_URL;
const backendBaseUrl = (envBaseUrl || "http://localhost:4000").replace(/\/$/, "");

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const body = options.body;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : defaultHeaders),
    ...(options.headers || {}),
  };
  const response = await fetch(`${backendBaseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message = errorPayload?.error || response.statusText;
    throw new Error(message);
  }

  return (await response.json()) as T;
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
}

export async function fetchOnchainEvents(creator?: string) {
  const query = new URLSearchParams();
  if (creator) {
    query.set("creator", creator);
  }

  const response = await request<{ events: OnchainEventSummary[] }>(
    `/events/onchain?${query.toString()}`,
  );
  return response.events;
}


