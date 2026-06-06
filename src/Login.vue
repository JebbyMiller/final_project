<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./stores/auth.js";


const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = "";

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    const data = await res.json();

    auth.setToken(data.token);
    await auth.refresh();

    router.push("/characters");
  } catch (err) {
    console.error(err);
    error.value = "Invalid email or password.";
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>Login</h2>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="login">Login</button>

    <p class="error" v-if="error">{{ error }}</p>

    <p>
      Don't have an account?
      <router-link to="/signup">Sign up</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  background: #121212;
  color: #e0e0e0;
  border-radius: 12px;
}
input {
  width: 100%;
  margin-bottom: 1rem;
  padding: .5rem;
  background: #1e1e1e;
  border: 1px solid #333;
  color: #e0e0e0;
  border-radius: 6px;
}
button {
  width: 100%;
  padding: .75rem;
  background: #4a6cff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}
.error {
  color: #ff6b6b;
  margin-top: 1rem;
}
</style>
