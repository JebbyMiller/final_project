import { createApp } from "vue";
import AppShell from "./AppShell.vue";
import router from "./router.js";

createApp(AppShell)
  .use(router)
  .mount("#app");
