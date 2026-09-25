<template>
  <section
    class="p-4 p-md-5 mb-4 text-white text-center bg-dark rounded-4 overflow-hidden shadow-sm"
  >
    <img
      src="/assets/images/vue3.jpg?id=1111"
      alt="Fashion"
      class="img-fluid rounded hero-image"
    />
  </section>

  <section class="p-4 p-md-5 mb-4 bg-white border rounded-4 shadow-sm">
    <h1 class="display-6 fw-bold mb-3">Aplicatie Produse Fashion</h1>
    <p class="lead text-secondary mb-4">
      Frontend cu: Vue 3 + Pinia conectat la backendul Node.js. Poti vedea,
      crea, edita si sterge produse din catalog.
    </p>
    <RouterLink class="btn btn-primary btn-lg" to="/products"
      >Mergi la produse</RouterLink
    >
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>