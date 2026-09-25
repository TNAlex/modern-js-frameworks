<template>
  <ProductToolbar />

  <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

  <div v-if="loadingList" class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
  </div>

  <template v-else>
    <ProductGrid v-if="products.length" />

    <div v-else class="empty-state">
      <h3 class="h5 mb-2">Nu exista produse pe aceasta pagina.</h3>
      <p class="text-muted mb-3">
        Adauga un produs nou sau revino la pagina anterioara.
      </p>
      <RouterLink class="btn btn-success" to="/products/new"
        >Adauga produs</RouterLink
      >
    </div>

    <ProductPagination />
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import ProductGrid from "../../components/products/ProductGrid.vue";
import ProductPagination from "../../components/products/ProductPagination.vue";
import ProductToolbar from "../../components/products/ProductToolbar.vue";
import { useProductsStore } from "../../stores/products";

const productsStore = useProductsStore();
const { error, loadingList, products } = storeToRefs(productsStore);

onMounted(() => {
  void productsStore.fetchProducts();
});
</script>