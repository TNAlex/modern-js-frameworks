import axios, { AxiosError } from "axios";
import { getStoredToken } from "./authStorage";
import { API_BASE_URL } from "../config";
import { CartItem } from "./cartStorage";

export interface OrderUserInfo {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface OrderRecord {
  orderId: string;
  user: OrderUserInfo;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
}

export interface CreateOrderResponse {
  message: string;
  order: OrderRecord;
}


const api = axios.create({
  baseURL: `${API_BASE_URL}/orders`,
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

export async function createOrder(
  items: CartItem[],
): Promise<CreateOrderResponse> {
  try {
    const response = await api.post<CreateOrderResponse>("", { items });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const apiMessage = axiosError.response?.data?.message;
    throw new Error(apiMessage || "Nu s-a putut salva comanda.");
  }
}

export async function getOrders(): Promise<OrderRecord[]> {
  const response = await api.get<OrderRecord[]>("");
  return response.data;
}
