import { cv, type AuthUser, type Portfolio } from "@/lib/cv";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

function buildAuthHeaders(token?: string, hasJsonBody = true) {
  const headers = new Headers();
  if (hasJsonBody) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function fetchPortfolio(): Promise<Portfolio> {
  const response = await fetch(`${API_BASE_URL}/portfolio`);
  if (!response.ok) {
    throw new Error("Unable to load portfolio from API.");
  }

  const payload = (await response.json()) as ApiResponse<Portfolio>;
  return payload.data;
}

export async function sendContactMessage(payload: ContactPayload) {
  const response = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || "Unable to send message.");
  }
  return body;
}

export async function loginAdmin(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = (await response.json().catch(() => ({}))) as ApiResponse<LoginResponse> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Login failed.");
  }

  return body.data;
}

export async function fetchCurrentUser(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: buildAuthHeaders(token, false),
  });

  const body = (await response.json().catch(() => ({}))) as ApiResponse<AuthUser> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Unable to verify session.");
  }

  return body.data;
}

export async function createPortfolio(payload: Portfolio, token: string) {
  const response = await fetch(`${API_BASE_URL}/portfolio`, {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as ApiResponse<Portfolio> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Failed to create portfolio.");
  }
  return body.data;
}

export async function updatePortfolio(portfolioId: string, payload: Portfolio, token: string) {
  const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}`, {
    method: "PUT",
    headers: buildAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as ApiResponse<Portfolio> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Failed to update portfolio.");
  }
  return body.data;
}

export async function deleteSectionItem(
  portfolioId: string,
  section: "experience" | "projects" | "education" | "certifications",
  itemId: string,
  token: string,
) {
  const response = await fetch(`${API_BASE_URL}/portfolio/${portfolioId}/${section}/${itemId}`, {
    method: "DELETE",
    headers: buildAuthHeaders(token, false),
  });
  const body = (await response.json().catch(() => ({}))) as ApiResponse<Portfolio> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "Failed to delete section item.");
  }
  return body.data;
}

export async function uploadAsset(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: buildAuthHeaders(token, false),
    body: formData,
  });

  const body = (await response.json().catch(() => ({}))) as ApiResponse<{ url: string }> & {
    message?: string;
  };

  if (!response.ok || !body.data) {
    throw new Error(body.message || "File upload failed.");
  }
  return body.data;
}

export function getFallbackPortfolio() {
  return cv;
}
