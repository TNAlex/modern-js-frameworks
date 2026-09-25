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

export type FormMode = "create" | "view" | "edit";

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}