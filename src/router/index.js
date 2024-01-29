import { createRouter, createWebHistory } from "vue-router";
import PokemonDetail from "../components/PokemonDetail.vue";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Pokemon List",
      component: HomeView,
    },
    {
      path: "/item/:id",
      name: "Pokemon Detail",
      component: PokemonDetail,
    },
  ],
});

export default router;
