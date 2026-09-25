<script setup lang="ts">
import { ref, computed } from "vue";
import Section from "./Section.vue";

const sections = ref([
  { id: 1, title: "Vue Basics", likes: 0 },
  { id: 2, title: "Composition API", likes: 0 },
  { id: 3, title: "Props & Emits", likes: 0 },
  { id: 4, title: "TypeScript", likes: 0 }
]);

function handleLike(id: number) {
  const section = sections.value.find((s) => s.id === id);

  if (section) {
    section.likes++;
  }
}

const totalLikes = computed(() =>
  sections.value.reduce((sum, section) => sum + section.likes, 0),
);
</script>

<template>
  <div style="border: 1px solid black; padding: 20px">
    <h2>Article (Părinte)</h2>

    <h3>Total Like-uri: {{ totalLikes }}</h3>

    <Section
      v-for="section in sections"
      :key="section.id"
      :id="section.id"
      :title="section.title"
      :likes="section.likes"
      @like="handleLike"
    />
  </div>
</template>