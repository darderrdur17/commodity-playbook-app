import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "https://commodityplaybook.com";

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync("auth_token");
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync("auth_token", token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync("auth_token");
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options?.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>("/api/mobile/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: any }>("/api/mobile/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request<{ user: any }>("/api/mobile/auth/me"),
};

// Playbook
export const playbookApi = {
  getProgress: () => request<any[]>("/api/user/progress"),
  updateProgress: (chapterId: string, progress: number) =>
    request("/api/user/progress", {
      method: "POST",
      body: JSON.stringify({ chapterId, progress }),
    }),
};

// Glossary
export const glossaryApi = {
  getAll: () => request<any[]>("/api/glossary"),
};

// Mentor
export const mentorApi = {
  getQuestions: () => request<any[]>("/api/mentor-connect"),
  submitQuestion: (segment: string, question: string, isPublic: boolean) =>
    request("/api/mentor-connect", {
      method: "POST",
      body: JSON.stringify({ segment, question, isPublic }),
    }),
};

// Community
export const communityApi = {
  getDeskChannel: () =>
    request<{ categories: any[]; questions: any[] }>("/api/mobile/desk-channel"),

  getJobOpenings: () =>
    request<{ jobs: any[]; filters: any }>("/api/mobile/job-openings"),

  joinWaitlist: (data: { email: string; name?: string; track: string; gdprOpt: boolean }) =>
    request("/api/waitlist", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
