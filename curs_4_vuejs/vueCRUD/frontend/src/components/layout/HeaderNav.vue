<template>
  <header class="app-header shadow-sm">
    <nav class="navbar navbar-dark bg-primary py-3">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/"
          >Fashion Catalog</RouterLink
        >

        <ul class="navbar-nav flex-row gap-3 ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/"
              >Home</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/products"
              >Produse</RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>