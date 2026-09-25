import axios from "axios";
import { getStoredToken } from "./authStorage";
import { API_BASE_URL } from "../config";

export interface UserItem {
  id: number;
  name: string;
  surname: string;
  email: string;
  address?: string;
  role: "admin" | "client";
  photo: string;
  createdAt: string;
}

export interface UserUpdatePayload {
  name: string;
  surname: string;
  email: string;
  address?: string;
}


const api = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function getUsers(): Promise<UserItem[]> {
  const response = await api.get<UserItem[]>("");
  return response.data;
}

export async function getUserById(id: number): Promise<UserItem> {
  const response = await api.get<UserItem>(`/${id}`);
  return response.data;
}

export async function updateUser(
  id: number,
  payload: UserUpdatePayload,
): Promise<UserItem> {
  const response = await api.put<UserItem>(`/${id}`, payload);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/${id}`);
}
