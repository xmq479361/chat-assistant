import { createRouter, createWebHistory } from "vue-router";
import ChatAssistant from "../components/ChatAssistant.vue";
import AuthPage from "../components/AuthPage.vue";

const routes = [
  {
    path: "/",
    name: "AuthPage",
    component: AuthPage,
  },
  {
    path: "/chat",
    name: "ChatAssistant",
    component: ChatAssistant,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
