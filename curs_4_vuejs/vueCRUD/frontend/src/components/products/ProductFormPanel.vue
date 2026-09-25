<template>
  <section class="card shadow-sm">
    <div class="card-body p-4">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h2 class="mb-0">{{ title }}</h2>
        <RouterLink class="btn btn-outline-secondary" to="/products"
          >Inapoi la produse</RouterLink
        >
      </div>

      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <div v-if="loadingProduct" class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <form v-else class="row g-3" @submit.prevent="submit">
        <div class="col-12">
          <label class="form-label" for="name">Nume produs</label>
          <input
            id="name"
            v-model="draft.name"
            :disabled="readOnly"
            class="form-control"
            type="text"
            @blur="touched.name = true"
          />
          <div
            v-if="touched.name && validation.name"
            class="form-error text-danger mt-1"
          >
            {{ validation.name }}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="price">Pret</label>
          <input
            id="price"
            v-model="draft.price"
            :disabled="readOnly"
            class="form-control"
            type="text"
            @blur="touched.price = true"
          />
          <div
            v-if="touched.price && validation.price"
            class="form-error text-danger mt-1"
          >
            {{ validation.price }}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <label class="form-label" for="rating">Rating (0-5)</label>
          <div id="rating" class="pt-2">
            <StarRating v-model="draft.rating" :disabled="readOnly" />
          </div>
          <small class="text-muted d-block mt-1"
            >Valoare selectata: {{ draft.rating }}/5</small
          >
        </div>

        <div class="col-12">
          <label class="form-label" for="image">URL imagine</label>
          <input
            id="image"
            v-model="draft.image"
            :disabled="readOnly"
            class="form-control"
            type="text"
            @blur="touched.image = true"
          />
          <div
            v-if="touched.image && validation.image"
            class="form-error text-danger mt-1"
          >
            {{ validation.image }}
          </div>
        </div>

        <div class="col-12">
          <ProductImagePreview />
        </div>

        <div
          v-if="mode === 'view'"
          class="col-12 d-flex justify-content-end gap-2"
        >
          <button class="btn btn-warning" type="button" @click="goToEdit">
            Editare
          </button>
        </div>

        <div v-else class="col-12 d-flex justify-content-end gap-2">
          <button class="btn btn-primary" :disabled="submitting" type="submit">
            {{ submitting ? "Se salveaza..." : submitLabel }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useProductsStore } from "../../stores/products";
import type { FormMode } from "../../types/product";
import ProductImagePreview from "./ProductImagePreview.vue";
import StarRating from "./StarRating.vue";

const props = defineProps<{
  mode: FormMode;
  productId: number | null;
}>();

const router = useRouter();
const productsStore = useProductsStore();
const { draft, error, loadingProduct, submitting } = storeToRefs(productsStore);

const touched = reactive({
  image: false,
  name: false,
  price: false,
});

const title = computed(() => productsStore.formTitle(props.mode));
const readOnly = computed(() => props.mode === "view");
const submitLabel = computed(() =>
  props.mode === "create" ? "Creeaza produs" : "Salveaza modificarile",
);

const validation = computed(() => ({
  image: draft.value.image ? "" : "Imaginea este obligatorie.",
  name: !draft.value.name
    ? "Numele produsului este obligatoriu."
    : draft.value.name.trim().length < 2
      ? "Numele produsului trebuie sa aiba cel putin 2 caractere."
      : "",
  price: draft.value.price ? "" : "Pretul este obligatoriu.",
}));

const isFormInvalid = computed(() =>
  Boolean(
    validation.value.image || validation.value.name || validation.value.price,
  ),
);

function markAllTouched(): void {
  touched.image = true;
  touched.name = true;
  touched.price = true;
}

function areAllFieldsEmpty(): boolean {
  return (
    !draft.value.image &&
    !draft.value.name &&
    !draft.value.price &&
    draft.value.rating === 0
  );
}

async function submit(): Promise<void> {
  if (readOnly.value || isFormInvalid.value) {
    markAllTouched();

    if (areAllFieldsEmpty()) {
      productsStore.setError(
        "Completeaza cel putin un camp inainte de trimitere.",
      );
    }

    return;
  }

  if (props.mode === "create") {
    const result = await productsStore.createProduct();

    if (result) {
      await router.push(`/products/${result.id}`);
    }

    return;
  }

  if (!props.productId) {
    productsStore.setError("Id produs invalid.");
    return;
  }

  const updated = await productsStore.updateProduct(props.productId);

  if (updated) {
    await router.push(`/products/${props.productId}`);
  }
}

async function goToEdit(): Promise<void> {
  if (!props.productId) {
    return;
  }

  await router.push(`/products/${props.productId}/edit`);
}
</script>