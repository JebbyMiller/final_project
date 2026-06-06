<script setup>
import { watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "./stores/auth.js";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// Re-read token + isAdmin every time the route changes (catches post-login navigation)
watch(route, () => auth.refresh(), { immediate: true });

function logout() {
  auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="shell">
    <nav v-if="auth.token" class="navbar">
      <span class="brand">⚔ Character Background Generator</span>
      <div class="nav-links">
        <router-link to="/characters">Characters</router-link>
        <router-link to="/worlds">Worlds</router-link>
        <router-link v-if="auth.isAdmin" to="/characters/generate">Generate Character</router-link>
        <router-link v-if="auth.isAdmin" to="/worlds/generate">Generate World</router-link>
      </div>
      <button @click="logout" class="logout-btn">Logout</button>
    </nav>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  background: #0d0d0d;
  color: #e0e0e0;
  font-family: "Inter", system-ui, sans-serif;
}

.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 2rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

.brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #4a6cff;
  margin-right: auto;
}

.nav-links {
  display: flex;
  gap: 1.25rem;
}

.nav-links a {
  color: #aaa;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #e0e0e0;
}

.logout-btn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid #555;
  border-radius: 6px;
  color: #aaa;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.content {
  padding: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}
</style>
