<template>
  <section class="d-flex align-items-center justify-content-between mb-3">
    <div>
      <h2 class="mb-0">Produse</h2>
      <small class="text-muted">Total: {{ total }}</small>
    </div>
    <RouterLink class="btn btn-success" to="/products/new"
      >Adauga produs</RouterLink
    >
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { useProductsStore } from "../../stores/products";

const { total } = storeToRefs(useProductsStore());
</script>