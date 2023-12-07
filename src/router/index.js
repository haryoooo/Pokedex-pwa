import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Item from "../components/Item.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/item/:id",
      name: "Item",
      component: Item,
    },
  ],
});

export default router;
