<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";


const router = useRouter();
const isAdmin = ref(false);
const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;

// Initialize character details
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

  const characterPayload = {
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
    stats: {
      strength: stats.value.strength,
      dexterity: stats.value.dexterity,
      constitution: stats.value.constitution,
      intelligence: stats.value.intelligence,
      wisdom: stats.value.wisdom,
      charisma: stats.value.charisma
    }
  };

  try {
    const res = await fetch("http://localhost:3000/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // replace later with real login token
      },
      body: JSON.stringify(characterPayload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json();
    response.value = data.character?.backgroundText || "[No background returned]";
  } catch (err) {
    console.error("Error generating background:", err);
    response.value = "Error generating background.";
  }

  loading.value = false;
}

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/is-admin`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  isAdmin.value = data.isAdmin;

  if (!isAdmin.value) {
    router.push("/viewer");
  }
});

</script>

<template>
  <div class="dark-container">
    <div class="header-row">
      <h2>Character Background Generator</h2>
      <div style="margin-left: auto">
        <button v-if="token" @click="logout" class="logout-btn">Logout</button>
      </div>
    </div>
    <br>
    <div class="form-grid">

      <!-- Name -->
      <label>
        Name:
        <input v-model="name" placeholder="Character name" />
      </label>

      <!-- Gender -->
      <label>
        Gender:
        <select v-model="gender">
          <option disabled value="">Select gender</option>
          <option v-for="g in genders" :key="g">{{ g }}</option>
        </select>
      </label>

      <!-- Orientation -->
      <label>
        Orientation:
        <input v-model="orientation" placeholder="e.g., heterosexual, bisexual" />
      </label>

      <!-- Class -->
      <label>
        Class:
        <input v-model="charClass" placeholder="e.g., Fighter, Wizard" />
      </label>

      <!-- Race -->
      <label>
        Race:
        <input v-model="race" placeholder="e.g., Elf, Human" />
      </label>

      <!-- Languages -->
      <label>
        Languages:
        <input v-model="languages" placeholder="Common, Elvish, etc." />
      </label>

      <!-- Alignment -->
      <label>
        Alignment:
        <select v-model="alignment">
          <option disabled value="">Select alignment</option>
          <option v-for="a in alignments" :key="a">{{ a }}</option>
        </select>
      </label>

      <!-- Personality -->
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

      <!-- Stats -->
      <div class="stats">
        <div class="section_title">
          <h3>Stats</h3>
        </div>
        <br>
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
    <pre class="output">{{ response }}</pre>
  </div>
</template>

<style scoped>
.dark-container {
  background: #121212;
  color: #e0e0e0;
  padding: 2rem;
  border-radius: 12px;
  font-family: "Inter", system-ui, sans-serif;
}

.header-row {
  display: flex;
  align-items: center;
}

input, select, textarea {
  width: 100%;
  padding: .5rem;
  background: #1e1e1e;
  color: #e0e0e0;
  border: 1px solid #333;
  border-radius: 6px;
}

input:focus, select:focus, textarea:focus {
  outline: 2px solid #4a6cff;
}

.form-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 1.5rem;
}

.logout-btn {
  margin-left: auto;
}


.stats {
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .5rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
}

.output {
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  white-space: pre-wrap;
}
</style>
