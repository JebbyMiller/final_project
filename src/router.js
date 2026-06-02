import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Login from "./Login.vue";
import Signup from "./Signup.vue";
import Viewer from "./Viewer.vue";


const routes = [
  { path: "/", component: App, meta: { requiresAuth: true } },
  { path: "/login", component: Login, meta: { guestOnly: true } },
  { path: "/signup", component: Signup, meta: { guestOnly: true } },
  { path: "/viewer", component: Viewer }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/login";
  }

  if (to.meta.guestOnly && token) {
    return "/";
  }
});


export default router;
