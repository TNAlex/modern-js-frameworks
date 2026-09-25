<template>
  <footer class="app-footer mt-auto py-3">
    <div
      class="container d-flex flex-column flex-md-row justify-content-between gap-2 small text-muted"
    >
      <span>Autor: Alex Tudorache</span>
      <span
        >Copyright © 2025 - {{ currentYear }} Fashion Catalog. Toate drepturile
        rezervate.</span
      >
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>