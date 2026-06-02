import api from "./api";

const TOKEN_KEY = "gobengali_token";
const EMAIL_KEY = "gobengali_email";

export interface AuthUser {
  email: string;
  name: string;
  plan: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  const res = await api.post("/auth/signup", { email, password, name });
  setToken(res.data.access_token);
  localStorage.setItem(EMAIL_KEY, email);
  return res.data;
}

export async function signin(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post("/auth/signin", { email, password });
  setToken(res.data.access_token);
  localStorage.setItem(EMAIL_KEY, email);
  return res.data;
}

export async function signout() {
  clearToken();
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    clearToken();
    return null;
  }
}
