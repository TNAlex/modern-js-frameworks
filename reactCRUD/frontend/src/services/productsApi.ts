import axios from "axios";
import { getStoredToken } from "./authStorage";
import { API_BASE_URL } from "../config";

export interface Product {
  id: number;
  image: string;
  name: string;
  price: string;
  rating: number;
}

export interface ProductPayload {
  image: string;
  name: string;
  price: string;
  rating: number;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}


const api = axios.create({
  baseURL: `${API_BASE_URL}/clothes`,
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

export async function getProducts(
  page = 0,
  perPage = 8,
): Promise<ProductsResponse> {
  const response = await api.get<ProductsResponse>("", {
    params: { page, perPage },
  });
  return response.data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<Product>(`/${id}`);
  return response.data;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await api.post<Product>("", payload);
  return response.data;
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
): Promise<Product> {
  const response = await api.put<Product>(`/${id}`, payload);
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/${id}`);
}
