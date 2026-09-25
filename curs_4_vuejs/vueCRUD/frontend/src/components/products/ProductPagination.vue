<template>
  <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
    <button
      class="btn btn-secondary page-link-button"
      :disabled="page === 0"
      type="button"
      @click="goPrevious"
    >
      Anterior
    </button>
    <span>Pagina {{ page + 1 }} din {{ totalPages || 1 }}</span>
    <button
      class="btn btn-secondary page-link-button"
      :disabled="page >= totalPages - 1"
      type="button"
      @click="goNext"
    >
      Urmator
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProductsStore } from "../../stores/products";

const productsStore = useProductsStore();
const { page, totalPages } = storeToRefs(productsStore);

function goPrevious(): void {
  void productsStore.previousPage();
}

function goNext(): void {
  void productsStore.nextPage();
}
</script>