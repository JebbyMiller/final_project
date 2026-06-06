<script setup>
import { ref } from "vue";

const token = localStorage.getItem("token");

const name = ref("");
const geography = ref("");
const factions = ref("");
const history = ref("");

const response = ref("");
const generatedWorldId = ref(null);
const loading = ref(false);
const error = ref("");

async function generate() {
  loading.value = true;
  error.value = "";
  response.value = "";

  const payload = {
    name: name.value,
    geography: geography.value,
    factions: factions.value,
    history: history.value,
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/worlds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    response.value = data.world?.lore || "[No lore returned]";
    generatedWorldId.value = data.world?._id;
  } catch (err) {
    console.error(err);
    error.value = "Error generating world lore.";
  }

  loading.value = false;
}

async function reroll() {
  if (!generatedWorldId.value) return;
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/worlds/${generatedWorldId.value}/reroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.value,
          geography: geography.value,
          factions: factions.value,
          history: history.value,
        }),
      }
    );
    const data = await res.json();
    response.value = data.world?.lore || "[No lore returned]";
  } catch (err) {
    error.value = "Error rerolling world lore.";
  }

  loading.value = false;
}
</script>

<template>
  <div class="dark-container">
    <h2>Generate World</h2>

    <div class="form-grid">
      <label class="full">
        World Name:
        <input v-model="name" placeholder="e.g., Azeroth, Middle Earth" />
      </label>

      <label>
        Geography:
        <textarea
          v-model="geography"
          rows="4"
          placeholder="Describe the land — continents, biomes, notable terrain..."
        />
      </label>

      <label>
        Factions:
        <textarea
          v-model="factions"
          rows="4"
          placeholder="Major political groups, empires, guilds, cults..."
        />
      </label>

      <label class="full">
        History:
        <textarea
          v-model="history"
          rows="4"
          placeholder="Key events, wars, disasters, founding myths..."
        />
      </label>
    </div>

    <div class="action-row">
      <button @click="generate" :disabled="loading">
        {{ loading ? "Generating..." : "Generate World Lore" }}
      </button>
      <button v-if="generatedWorldId" @click="reroll" :disabled="loading" class="reroll-btn">
        Reroll
      </button>
      <router-link to="/worlds" class="view-link">View All Worlds</router-link>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="response">
      <h3>Generated Lore:</h3>
      <pre class="output">{{ response }}</pre>
    </div>
  </div>
</template>

<style scoped>
.dark-container {
  color: #e0e0e0;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  background: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 6px;
  margin-top: 0.25rem;
}

input:focus,
textarea:focus {
  outline: 2px solid #4a6cff;
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1.5rem;
}

.full {
  grid-column: span 2;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.6rem 1.5rem;
  background: #4a6cff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reroll-btn {
  background: #333;
}

.view-link {
  color: #4a6cff;
  margin-left: auto;
}

.error {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.output {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
