<script setup>
import { ref } from "vue";

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

const stats = ref({
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10
});

const response = ref("");
const loading = ref(false);

const alignments = [
  "Lawful Good (LG)",
  "Neutral Good (NG)",
  "Chaotic Good (CG)",
  "Lawful Neutral (LN)",
  "Neutral (N)",
  "Chaotic Neutral (CN)",
  "Lawful Evil (LE)",
  "Neutral Evil (NE)",
  "Chaotic Evil (CE)"
];

const genders = [
  "Male",
  "Female",
  "Nonbinary",
  "Transgender",
  "Agender",
  "Genderfluid",
  "Other"
];

async function generateBackground() {
  loading.value = true;
  response.value = "";

  const prompt = `
    Create a detailed Dungeons & Dragons character background using the following details:

    Gender: ${gender.value}
    Orientation: ${orientation.value}
    Class: ${charClass.value}
    Race: ${race.value}
    Languages: ${languages.value}

    Personality Traits: ${personalityTraits.value}
    Ideals: ${ideals.value}
    Bonds: ${bonds.value}
    Flaws: ${flaws.value}

    Alignment: ${alignment.value}

    Stats:
    - Strength: ${stats.value.strength}
    - Dexterity: ${stats.value.dexterity}
    - Constitution: ${stats.value.constitution}
    - Intelligence: ${stats.value.intelligence}
    - Wisdom: ${stats.value.wisdom}
    - Charisma: ${stats.value.charisma}

    Write a compelling, lore‑friendly backstory (3–6 paragraphs) that ties all of these elements together.
  `;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  response.value = data.text;
  loading.value = false;
}
</script>

<template>
  <div>
    <h2>Create a D&D Character Background</h2>

    <div class="form-grid">
      <label>
        Gender:
        <select v-model="gender">
          <option disabled value="">Select gender</option>
          <option v-for="g in genders" :key="g">{{ g }}</option>
        </select>
      </label>
      <label>
        Orientation:
        <input v-model="orientation" placeholder="e.g., heterosexual, bisexual, etc." />
      </label>
      <label>
        Class:
        <input v-model="charClass" placeholder="e.g., Fighter, Wizard, Rogue" />
      </label>
      <label>
        Race:
        <input v-model="race" placeholder="e.g., Elf, Human, Tiefling" />
      </label>
      <label>
        Languages:
        <input v-model="languages" placeholder="Common, Elvish, etc." />
      </label>
      <label>
        Alignment:
        <select v-model="alignment">
          <option disabled value="">Select alignment</option>
          <option v-for="a in alignments" :key="a">{{ a }}</option>
        </select>
      </label>
      <label>
        Personality Traits:
        <textarea v-model="personalityTraits" rows="2" />
      </label>
      <label>
        Ideals:
        <textarea v-model="ideals" rows="2" />
      </label>
      <label>
        Bonds:
        <textarea v-model="bonds" rows="2" />
      </label>
      <label>
        Flaws:
        <textarea v-model="flaws" rows="2" />
      </label>
      <div class="stats">
        <h3>Stats</h3>
        <label>Strength: <input type="number" v-model.number="stats.strength" /></label>
        <label>Dexterity: <input type="number" v-model.number="stats.dexterity" /></label>
        <label>Constitution: <input type="number" v-model.number="stats.constitution" /></label>
        <label>Intelligence: <input type="number" v-model.number="stats.intelligence" /></label>
        <label>Wisdom: <input type="number" v-model.number="stats.wisdom" /></label>
        <label>Charisma: <input type="number" v-model.number="stats.charisma" /></label>
      </div>
    </div>
    <button @click="generateBackground" :disabled="loading">
      {{ loading ? "Generating..." : "Generate Background" }}
    </button>
    <h3>Generated Background:</h3>
    <pre>{{ response }}</pre>
  </div>
</template>

<style scoped>
.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1.5rem;
}

.stats {
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .5rem;
  padding: 1rem;
  background: #f7f7f7;
  border-radius: 8px;
}
</style>
