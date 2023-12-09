<script>
import Headers from "../components/Header.vue";
import Region from "../components/Region.vue";
import PokemonList from "../components/PokemonList.vue";
import PokemonItem from "../components/PokemonItem.vue";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";

export default {
  name: "HomeView",
  components: { Headers, Region, PokemonList, PokemonItem },
  props: ["value", "loading"],
  setup() {
    const route = useRoute();
    const currentPath = ref(route?.path);
    const currentId = ref(route?.params?.id);

    // Watch for changes in the route and update the currentPath variable
    watchEffect(() => {
      currentPath.value = route?.path;
      currentId.value = route?.params?.id;
    });

    return {
      currentPath,
      currentId,
    };
  },
};
</script>

<template>
  <Headers
    v-if="!currentPath?.includes('item')"
    :value="value"
    :loading="loading"
  />
  <PokemonItem v-if="currentPath?.includes('item')" :id="currentId" />
  <PokemonList v-if="currentPath?.includes('region')" :id="currentId" />
  <Region v-if="!currentId" />
</template>

<style scoped></style>
