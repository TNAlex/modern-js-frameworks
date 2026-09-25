<script setup lang="ts">
const props = defineProps({
  id: Number,
  title: String,
  likes: Number,
});

const emit = defineEmits(["like"]);

function sendLike() {
  emit("like", props.id);
}

function sendAlert() {
  alert(`Alert for section: ${props.title}`);
}
</script>

<template>
  <div style="border: 1px solid blue; margin: 10px; padding: 15px">
    <h3>{{ title }}</h3>

    <p>
      Like-uri pentru această secțiune:
      <strong>{{ likes }}</strong>
    </p>

    <button @click="sendLike">👍 Like</button>
    <button @click="sendAlert">⚠️ Alert</button>
  </div>
</template>

<style scoped></style>