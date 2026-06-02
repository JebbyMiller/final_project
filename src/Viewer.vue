<script setup>
import { ref, onMounted } from "vue";

const backgrounds = ref([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/characters/all`);
    if (!res.ok) throw new Error("Failed to load backgrounds");

    const data = await res.json();
    backgrounds.value = data.characters || [];
  } catch (err) {
    console.error(err);
    error.value = "Unable to load saved backgrounds.";
  }

  loading.value = false;
});
</script>

<template>
  <div class="viewer-container">
    <h2>Sorry!</h2>
    <p class="explanation">
      I have to pay for each generated result, so only my account can create new
      backgrounds. But you can browse everything I’ve already generated.
    </p>

    <div v-if="loading" class="loading">Loading saved backgrounds…</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-for="c in backgrounds" :key="c._id" class="card">
      <h3>{{ c.name }}</h3>
      <pre class="background-text">{{ c.backgroundText }}</pre>
    </div>

    <div v-if="!loading && backgrounds.length === 0" class="empty">
      No saved backgrounds yet.
    </div>
  </div>
</template>

<style scoped>
.viewer-container {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
  color: #e0e0e0;
  font-family: "Inter", system-ui, sans-serif;
}

.explanation {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  opacity: 0.9;
}

.loading {
  margin-top: 2rem;
  font-size: 1.2rem;
  opacity: 0.8;
}

.error {
  color: #ff6b6b;
  margin-top: 1rem;
}

.card {
  background: #1a1a1a;
  padding: 1.25rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  border: 1px solid #333;
}

.card h3 {
  margin-bottom: 0.75rem;
}

.background-text {
  white-space: pre-wrap;
  background: #111;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #222;
}

.empty {
  margin-top: 2rem;
  opacity: 0.7;
}
</style>
