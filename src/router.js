import { createRouter, createWebHistory } from "vue-router";
import Login from "./Login.vue";
import Signup from "./Signup.vue";
import Characters from "./Characters.vue";
import Worlds from "./Worlds.vue";
import GenerateCharacter from "./GenerateCharacter.vue";
import GenerateWorld from "./GenerateWorld.vue";

const routes = [
  { path: "/", redirect: "/characters" },
  { path: "/login", component: Login, meta: { guestOnly: true } },
  { path: "/signup", component: Signup, meta: { guestOnly: true } },
  { path: "/characters", component: Characters, meta: { requiresAuth: true } },
  { path: "/characters/generate", component: GenerateCharacter, meta: { requiresAuth: true, adminOnly: true } },
  { path: "/worlds", component: Worlds, meta: { requiresAuth: true } },
  { path: "/worlds/generate", component: GenerateWorld, meta: { requiresAuth: true, adminOnly: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const token = localStorage.getItem("token");

  if (to.meta.guestOnly && token) return "/characters";
  if (to.meta.requiresAuth && !token) return "/login";

  if (to.meta.adminOnly && token) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/is-admin`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!data.isAdmin) return "/characters";
    } catch {
      return "/characters";
    }
  }
});

export default router;
