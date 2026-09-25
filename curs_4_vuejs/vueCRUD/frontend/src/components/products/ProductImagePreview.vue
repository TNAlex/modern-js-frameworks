<template>
  <div v-if="draft.image" class="preview border rounded p-2 bg-light">
    <img
      :src="resolveImageUrl(draft.image)"
      alt="Preview"
      class="img-fluid rounded"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProductsStore } from "../../stores/products";
import { resolveImageUrl } from "../../utils/products";

const { draft } = storeToRefs(useProductsStore());
</script>