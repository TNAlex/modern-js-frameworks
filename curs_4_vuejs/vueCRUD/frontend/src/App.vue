<template>
  <div class="app-shell">
    <HeaderNav />

    <main class="container py-4 app-main">
      <RouterView />
    </main>

    <FooterBar />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import FooterBar from "./components/layout/FooterBar.vue";
import HeaderNav from "./components/layout/HeaderNav.vue";
</script>