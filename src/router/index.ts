import LoginPage from "@/pages/LoginPage.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginPage,
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
