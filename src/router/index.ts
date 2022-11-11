import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/chat-room",
      name: "chat-room",
      component: () => import("@/pages/ChatDetailPage.vue"),
    },
    {
      path: "/dev",
      name: "dev",
      component: () => import("@/pages/DevPage.vue"),
    },
  ],
});

export default router;
