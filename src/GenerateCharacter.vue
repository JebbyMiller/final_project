<script setup>
import { ref } from "vue";
import { useAuthStore } from "./stores/auth.js";
import {
  genders,
  alignments,
  classes,
  races,
  fillDefaults,
  rollStat,
  rollAllStats,
} from "./utils/randomCharacter.js";

const auth = useAuthStore();

// ─── Form state ───────────────────────────────────────────────────────────────
const name = ref("");
const gender = ref("");
const orientation = ref("");
const charClass = ref("");
const race = ref("");
const languages = ref("");
const personalityTraits = ref("");
const ideals = ref("");
const bonds = ref("");
const flaws = ref("");
const alignment = ref("");
const stats = ref({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });

const response = ref("");
const generatedCharId = ref(null);
const loading = ref(false);
const error = ref("");

// ─── Stat helpers ─────────────────────────────────────────────────────────────
function rollAll() {
  stats.value = rollAllStats();
}

function rollOne(stat) {
  stats.value = { ...stats.value, [stat]: rollStat() };
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function generate() {
  loading.value = true;
  error.value = "";
  response.value = "";

  // Fill any empty fields with random values before sending
  const filled = fillDefaults({
    name: name.value,
    gender: gender.value,
    orientation: orientation.value,
    charClass: charClass.value,
    race: race.value,
    languages: languages.value,
    personalityTraits: personalityTraits.value,
    ideals: ideals.value,
    bonds: bonds.value,
    flaws: flaws.value,
    alignment: alignment.value,
    stats: { ...stats.value },
  });

  // Reflect any randomised values back into the form so the user can see what was chosen
  name.value = filled.name;
  gender.value = filled.gender;
  orientation.value = filled.orientation;
  charClass.value = filled.charClass;
  race.value = filled.race;
  languages.value = filled.languages;
  personalityTraits.value = filled.personalityTraits;
  ideals.value = filled.ideals;
  bonds.value = filled.bonds;
  flaws.value = filled.flaws;
  alignment.value = filled.alignment;
  stats.value = filled.stats;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(filled),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const data = await res.json();
    response.value = data.character?.backgroundText || "[No background returned]";
    generatedCharId.value = data.character?._id;
  } catch (err) {
    console.error(err);
    error.value = "Error generating character background.";
  }

  loading.value = false;
}

async function reroll() {
  if (!generatedCharId.value) return;
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/characters/${generatedCharId.value}/reroll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          name: name.value,
          charClass: charClass.value,
          race: race.value,
          stats: { ...stats.value },
        }),
      }
    );
    const data = await res.json();
    response.value = data.character?.backgroundText || "[No background returned]";
  } catch {
    error.value = "Error rerolling background.";
  }

  loading.value = false;
}
</script>

<template>
  <div class="dark-container">
    <h2>Generate Character</h2>
    <p class="hint">Leave any field blank — it will be randomly filled when you generate.</p>

    <div class="form-grid">

      <!-- Name -->
      <label>
        Name:
        <input v-model="name" placeholder="Name" />
      </label>

      <!-- Gender -->
      <label>
        Gender:
        <select v-model="gender">
          <option value="">Random</option>
          <option v-for="g in genders" :key="g">{{ g }}</option>
        </select>
      </label>

      <!-- Orientation -->
      <label>
        Orientation:
        <input v-model="orientation" placeholder="Heterosexual, homosexual, etc." />
      </label>

      <!-- Class -->
      <label>
        Class:
        <div class="input-with-die">
          <input v-model="charClass" placeholder="Fighter, Mage, Thief, etc." list="class-list" />
          <datalist id="class-list">
            <option v-for="c in classes" :key="c" :value="c" />
          </datalist>
        </div>
      </label>

      <!-- Race -->
      <label>
        Race:
        <div class="input-with-die">
          <input v-model="race" placeholder="Human, Elf, Dwarf, etc." list="race-list" />
          <datalist id="race-list">
            <option v-for="r in races" :key="r" :value="r" />
          </datalist>
        </div>
      </label>

      <!-- Languages -->
      <label>
        Languages:
        <input v-model="languages" placeholder="Common, Dwarvish, Elvish, etc." />
      </label>

      <!-- Alignment -->
      <label>
        Alignment:
        <select v-model="alignment">
          <option value="">Random</option>
          <option v-for="a in alignments" :key="a">{{ a }}</option>
        </select>
      </label>

      <!-- Personality -->
      <label>
        Personality Traits:
        <textarea v-model="personalityTraits" rows="2" placeholder="Charismatic, shadey, flirty, etc." />
      </label>

      <label>
        Ideals:
        <textarea v-model="ideals" rows="2" placeholder="Justice, redemption, might, etc." />
      </label>

      <label>
        Bonds:
        <textarea v-model="bonds" rows="2" placeholder="Life debt, revenge for familial murder, etc." />
      </label>

      <label>
        Flaws:
        <textarea v-model="flaws" rows="2" placeholder="Timid, quick-tempered, naive, etc." />
      </label>

      <!-- Stats -->
      <div class="stats-box">
        <div class="stats-header">
          <h3>Stats</h3>
          <button type="button" class="roll-all-btn" @click="rollAll" title="Roll all stats (4d6 drop lowest)">
            🎲 Roll All
          </button>
        </div>
        <div class="stats-grid">
          <div v-for="stat in ['str','dex','con','int','wis','cha']" :key="stat" class="stat-row">
            <span class="stat-label">{{ stat.toUpperCase() }}</span>
            <input type="number" v-model.number="stats[stat]" min="1" max="30" />
            <button type="button" class="die-btn" @click="rollOne(stat)" :title="`Roll ${stat.toUpperCase()}`">🎲</button>
          </div>
        </div>
      </div>

    </div>

    <div class="action-row">
      <button @click="generate" :disabled="loading">
        {{ loading ? "Generating..." : "Generate Background" }}
      </button>
      <button v-if="generatedCharId" @click="reroll" :disabled="loading" class="reroll-btn">
        Reroll Background
      </button>
      <router-link to="/characters" class="view-link">View All Characters →</router-link>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="response" class="result">
      <h3>Generated Background:</h3>
      <pre class="output">{{ response }}</pre>
    </div>
  </div>
</template>

<style scoped>
.dark-container {
  color: #e0e0e0;
}

.hint {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  background: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 6px;
  margin-top: 0.25rem;
  box-sizing: border-box;
}

input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #4a6cff;
}

/* suppress the browser's default number spinner arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
input[type="number"] { -moz-appearance: textfield; }

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #aaa;
}

.input-with-die {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.input-with-die input {
  margin-top: 0;
  flex: 1;
}

/* ─── Stats box ─────────────────────────────────── */
.stats-box {
  grid-column: span 2;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1rem 1.25rem 1.25rem;
}

.stats-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.stats-header h3 {
  margin: 0;
  font-size: 1rem;
}

.roll-all-btn {
  padding: 0.35rem 0.9rem;
  background: #2a2a3a;
  border: 1px solid #4a6cff;
  border-radius: 6px;
  color: #a0aaff;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.15s;
}

.roll-all-btn:hover {
  background: #3a3a55;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #7a9fff;
  width: 2rem;
  flex-shrink: 0;
  letter-spacing: 0.05em;
}

.stat-row input {
  margin-top: 0;
  width: 3.5rem;
  text-align: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid #444;
  border-radius: 0;
  padding: 0.15rem 0.25rem;
  font-size: 1rem;
  color: #e0e0e0;
}

.stat-row input:focus {
  outline: none;
  border-bottom-color: #4a6cff;
}

.die-btn {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.15s, transform 0.1s;
  margin-left: auto;
}

.die-btn:hover {
  opacity: 1;
  transform: rotate(-15deg) scale(1.2);
}

/* ─── Actions ───────────────────────────────────── */
.action-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
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
  background: #2a2a2a;
  border: 1px solid #555;
}

.view-link {
  color: #4a6cff;
  text-decoration: none;
  margin-left: auto;
  font-size: 0.9rem;
}

.error {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

.result h3 {
  margin-bottom: 0.5rem;
}

.output {
  background: #1a1a1a;
  padding: 1.25rem;
  border-radius: 8px;
  white-space: pre-wrap;
  line-height: 1.7;
  font-size: 0.95rem;
  border: 1px solid #2a2a2a;
}
</style>
