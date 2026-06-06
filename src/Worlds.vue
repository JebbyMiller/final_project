<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "./stores/auth.js";

const auth = useAuthStore();

const worlds = ref([]);
const loading = ref(true);
const error = ref("");
const search = ref("");
const selected = ref(null);

async function load(q = "") {
  loading.value = true;
  error.value = "";
  try {
    const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/worlds/browse`);
    if (q) url.searchParams.set("search", q);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (!res.ok) throw new Error("Failed to load worlds");
    const data = await res.json();
    worlds.value = data.worlds || [];
  } catch (err) {
    error.value = "Unable to load worlds.";
    console.error(err);
  }
  loading.value = false;
}

async function deleteWorld(id) {
  if (!confirm("Delete this world?")) return;
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/worlds/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    worlds.value = worlds.value.filter((w) => w._id !== id);
    if (selected.value?._id === id) selected.value = null;
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => load());
</script>

<template>
  <div>
    <div class="page-header">
      <h2>Worlds</h2>
    </div>

    <div class="search-bar">
      <input
        v-model="search"
        placeholder="Search worlds..."
        @keydown.enter="load(search)"
      />
      <button @click="load(search)">Search</button>
      <button v-if="search" @click="search = ''; load('')" class="clear-btn">Clear</button>
    </div>

    <div v-if="loading" class="loading">Loading worlds…</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && worlds.length === 0 && !error" class="empty">
      No worlds found.
    </div>

    <div class="grid">
      <div
        v-for="w in worlds"
        :key="w._id"
        class="card"
        @click="selected = selected?._id === w._id ? null : w"
      >
        <div class="card-header">
          <div>
            <h3>{{ w.name }}</h3>
            <span class="meta" v-if="w.geography">{{ w.geography }}</span>
          </div>
          <button v-if="auth.isAdmin" @click.stop="deleteWorld(w._id)" class="delete-btn">✕</button>
        </div>

        <div v-if="selected?._id === w._id" class="expanded">
          <div v-if="w.factions" class="field">
            <strong>Factions:</strong> {{ w.factions }}
          </div>
          <div v-if="w.history" class="field">
            <strong>History:</strong> {{ w.history }}
          </div>
          <pre class="lore-text">{{ w.lore || "No lore generated." }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  color: #e0e0e0;
}

.search-bar button {
  padding: 0.5rem 1rem;
  background: #4a6cff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.clear-btn {
  background: #333 !important;
}

.loading,
.empty {
  opacity: 0.7;
  margin-top: 1rem;
}

.error {
  color: #ff6b6b;
  margin-top: 0.5rem;
}

.grid {
  display: grid;
  gap: 1rem;
}

.card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.card:hover {
  border-color: #4a6cff;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.card h3 {
  margin: 0 0 0.25rem;
}

.meta {
  font-size: 0.85rem;
  color: #888;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
}

.delete-btn:hover {
  color: #ff6b6b;
}

.expanded {
  margin-top: 1rem;
  border-top: 1px solid #333;
  padding-top: 1rem;
}

.field {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #ccc;
}

.lore-text {
  white-space: pre-wrap;
  background: #111;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #222;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-top: 0.75rem;
}
</style>
