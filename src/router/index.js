import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PokemonItem from "../components/PokemonItem.vue";
import PokemonList from "../components/PokemonList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/region/:id",
      name: "Pokemon List",
      component: PokemonList,
    },
    {
      path: "/item/:id",
      name: "Item",
      component: PokemonItem,
    },
  ],
});

export default router;
