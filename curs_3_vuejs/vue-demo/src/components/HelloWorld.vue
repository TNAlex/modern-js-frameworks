<script setup lang="ts">
import { ref } from 'vue'
import Article from "./Article.vue";
const count = ref(0)
</script>

<template>
  <section id="center">
    <button type="button" class="counter" @click="count++">
      Count is {{ count }}
    </button>
  </section>
  <Article />
 
  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
