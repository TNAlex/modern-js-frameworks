<template>
  <div class="row g-3">
    <div
      v-for="product in products"
      :key="product.id"
      class="col-12 col-md-6 col-lg-3"
    >
      <div class="card h-100 shadow-sm">
        <img
          :src="resolveImageUrl(product.image)"
          :alt="product.name"
          class="card-img-top product-image"
        />

        <div class="card-body d-flex flex-column">
          <h5 class="card-title">{{ product.name }}</h5>
          <p class="card-text mb-1">
            <strong>Pret:</strong> {{ product.price }}
          </p>

          <div class="d-flex align-items-center gap-2 mb-3">
            <strong>Rating:</strong>
            <StarRating :model-value="product.rating" readonly />
            <span class="small text-muted">({{ product.rating }}/5)</span>
          </div>

          <div class="mt-auto d-grid gap-2">
            <RouterLink
              class="btn btn-outline-primary btn-sm"
              :to="`/products/${product.id}`"
            >
              Vizualizare
            </RouterLink>
            <RouterLink
              class="btn btn-outline-warning btn-sm"
              :to="`/products/${product.id}/edit`"
            >
              Editare
            </RouterLink>
            <button
              class="btn btn-outline-danger btn-sm"
              :disabled="deletingId === product.id"
              type="button"
              @click="handleDelete(product.id, product.name)"
            >
              {{ deletingId === product.id ? "Se sterge..." : "Stergere" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useProductsStore } from "../../stores/products";
import type { Product } from "../../types/product";
import { resolveImageUrl } from "../../utils/products";
import StarRating from "./StarRating.vue";

const productsStore = useProductsStore();
const { deletingId, products } = storeToRefs(productsStore);

function handleDelete(id: Product["id"], name: Product["name"]): void {
  if (!window.confirm(`Sigur doresti sa stergi produsul "${name}"?`)) {
    return;
  }

  void productsStore.deleteProduct(id);
}
</script>