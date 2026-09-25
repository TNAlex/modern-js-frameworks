<template>
  <ProductFormPanel :mode="mode" :product-id="normalizedId" />
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import ProductFormPanel from "../../components/products/ProductFormPanel.vue";
import { useProductsStore } from "../../stores/products";
import type { FormMode } from "../../types/product";

const props = defineProps<{
  mode: FormMode;
  id?: string;
}>();

const productsStore = useProductsStore();
const normalizedId = computed(() => {
  if (!props.id) {
    return null;
  }

  const parsedId = Number(props.id);
  return Number.isNaN(parsedId) ? null : parsedId;
});

watch(
  () => [props.mode, props.id],
  async () => {
    if (props.mode === "create") {
      productsStore.prepareCreate();
      return;
    }

    if (normalizedId.value === null) {
      productsStore.setError("Id produs invalid.");
      return;
    }

    await productsStore.fetchProductById(normalizedId.value);
  },
  { immediate: true },
);
</script>