import { defineStore } from "pinia";
import { requestJson, requestVoid } from "../utils/http";
import type {
  FormMode,
  Product,
  ProductPayload,
  ProductsResponse,
} from "../types/product";

const API_URL = "http://localhost:3000/clothes";

function createDraft(): ProductPayload {
  return {
    image: "",
    name: "",
    price: "",
    rating: 0,
  };
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
    currentProduct: null as Product | null,
    draft: createDraft(),
    page: 0,
    perPage: 8,
    totalPages: 0,
    total: 0,
    error: "",
    loadingList: false,
    loadingProduct: false,
    submitting: false,
    deletingId: null as number | null,
  }),

  getters: {
    formTitle: () => (mode: FormMode) => {
      if (mode === "create") {
        return "Adauga produs";
      }

      if (mode === "edit") {
        return "Editare produs";
      }

      return "Vizualizare produs";
    },
  },

  actions: {
    setError(message: string): void {
      this.error = message;
    },

    clearError(): void {
      this.error = "";
    },

    prepareCreate(): void {
      this.currentProduct = null;
      this.draft = createDraft();
      this.loadingProduct = false;
      this.submitting = false;
      this.clearError();
    },

    async fetchProducts(): Promise<void> {
      this.loadingList = true;
      this.clearError();

      try {
        const params = new URLSearchParams({
          page: String(this.page),
          perPage: String(this.perPage),
        });

        const response = await requestJson<ProductsResponse>(
          `${API_URL}?${params.toString()}`,
        );
        this.products = response.items;
        this.totalPages = response.totalPages;
        this.total = response.total;
      } catch (error) {
        this.setError(this.getLoadErrorMessage(error));
      } finally {
        this.loadingList = false;
      }
    },

    async fetchProductById(id: number): Promise<void> {
      this.loadingProduct = true;
      this.clearError();

      try {
        const product = await requestJson<Product>(`${API_URL}/${id}`);
        this.currentProduct = product;
        this.draft = {
          image: product.image,
          name: product.name,
          price: product.price,
          rating: product.rating,
        };
      } catch (error) {
        this.currentProduct = null;
        this.draft = createDraft();
        this.setError(this.getProductErrorMessage(error));
      } finally {
        this.loadingProduct = false;
      }
    },

    async createProduct(): Promise<Product | null> {
      this.submitting = true;
      this.clearError();

      try {
        const product = await requestJson<Product>(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.draft),
        });

        this.currentProduct = product;
        return product;
      } catch {
        this.setError("Nu s-a putut crea produsul.");
        return null;
      } finally {
        this.submitting = false;
      }
    },

    async updateProduct(id: number): Promise<boolean> {
      this.submitting = true;
      this.clearError();

      try {
        const product = await requestJson<Product>(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.draft),
        });

        this.currentProduct = product;
        this.draft = {
          image: product.image,
          name: product.name,
          price: product.price,
          rating: product.rating,
        };
        return true;
      } catch {
        this.setError("Nu s-a putut actualiza produsul.");
        return false;
      } finally {
        this.submitting = false;
      }
    },

    async deleteProduct(id: number): Promise<boolean> {
      this.deletingId = id;
      this.clearError();

      try {
        await requestVoid(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (this.products.length === 1 && this.page > 0) {
          this.page -= 1;
        }

        await this.fetchProducts();
        return true;
      } catch {
        this.setError("Nu s-a putut sterge produsul.");
        return false;
      } finally {
        this.deletingId = null;
      }
    },

    async previousPage(): Promise<void> {
      if (this.page <= 0) {
        return;
      }

      this.page -= 1;
      await this.fetchProducts();
    },

    async nextPage(): Promise<void> {
      if (this.page >= this.totalPages - 1) {
        return;
      }

      this.page += 1;
      await this.fetchProducts();
    },

    getLoadErrorMessage(error: unknown): string {
      const status = this.getStatus(error);
      return `Nu s-au putut incarca produsele${status ? ` (status ${status})` : ""}. Verifica backendul.`;
    },

    getProductErrorMessage(error: unknown): string {
      const status = this.getStatus(error);
      return `Produsul nu a fost gasit${status ? ` (status ${status})` : ""}.`;
    },

    getStatus(error: unknown): number | null {
      if (typeof error === "object" && error && "status" in error) {
        const status = (error as { status?: unknown }).status;
        return typeof status === "number" ? status : null;
      }

      return null;
    },
  },
});