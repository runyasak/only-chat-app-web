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
      path: "/chats/:id",
      name: "chats-id",
      component: () => import("@/pages/ChatDetailPage.vue"),
    },
  ],
});

export default router;
