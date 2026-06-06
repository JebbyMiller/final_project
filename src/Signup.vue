<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

async function signup() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  error.value = "";

  if (!emailRegex.test(email.value)) {
    error.value = "Please enter a valid email address.";
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value
      })
    });

    if (!res.ok) {
      const data = await res.json();
      throw data;
    }
    const data = await res.json();
    localStorage.setItem("token", data.token);
    
    router.push("/");
  } catch (err) {
    if (err.error?.includes("E11000")) {
      error.value = "Account already exists; please sign in to continue."
    } else {
      error.value = "Signup failed.";
    }
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>Sign Up</h2>

    <input v-model="username" placeholder="Username" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="signup">Create Account</button>

    <p class="error" v-if="error">{{ error }}</p>

    <p>
      Already have an account?
      <router-link to="/login">Login</router-link>
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
