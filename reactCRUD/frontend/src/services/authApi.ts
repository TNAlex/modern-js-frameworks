import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config";

export interface AuthUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  address?: string;
  role: "admin" | "client";
  photo: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  photo: File;
}

export interface LoginPayload {
  email: string;
  password: string;
}


const api = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: 10000,
});

function mapError(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    return (
      (err.response?.data as { message?: string } | undefined)?.message ||
      fallback
    );
  }

  return fallback;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  try {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("surname", payload.surname);
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("repeatPassword", payload.repeatPassword);
    formData.append("photo", payload.photo);

    const response = await api.post<AuthResponse>("/register", formData);
    return response.data;
  } catch (err) {
    throw new Error(mapError(err, "Nu s-a putut crea contul."), {
      cause: err,
    });
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>("/login", payload);
    // console.log("Login response22:", response.data);
    return response.data;
  } catch (err) {
    throw new Error(mapError(err, "Nu s-a putut face autentificarea."), {
      cause: err,
    });
  }
}
