import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token"));
  const isAdmin = ref(false);

  /** Call after login or on any navigation to sync state from localStorage. */
  async function refresh() {
    token.value = localStorage.getItem("token");

    if (!token.value) {
      isAdmin.value = false;
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/is-admin`,
        { headers: { Authorization: `Bearer ${token.value}` } }
      );
      const data = await res.json();
      isAdmin.value = data.isAdmin;
    } catch {
      isAdmin.value = false;
    }
  }

  function setToken(t) {
    token.value = t;
    localStorage.setItem("token", t);
  }

  function logout() {
    token.value = null;
    isAdmin.value = false;
    localStorage.removeItem("token");
  }

  return { token, isAdmin, refresh, setToken, logout };
});
