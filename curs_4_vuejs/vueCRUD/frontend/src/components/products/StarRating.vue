<template>
  <div
    class="star-rating"
    :aria-label="`Rating ${modelValue} din ${max}`"
    role="img"
  >
    <button
      v-for="star in stars"
      :key="star"
      :class="[
        'star-rating__star',
        {
          'is-filled': star <= modelValue,
          'is-interactive': !readonly && !disabled,
        },
      ]"
      :disabled="readonly || disabled"
      type="button"
      @click="updateValue(star)"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    max?: number;
    readonly?: boolean;
    disabled?: boolean;
  }>(),
  {
    max: 5,
    readonly: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const stars = computed(() =>
  Array.from({ length: props.max }, (_, index) => index + 1),
);

function updateValue(value: number): void {
  if (props.readonly || props.disabled) {
    return;
  }

  emit("update:modelValue", value);
}
</script>