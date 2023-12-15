<script>
import Headers from "../components/Header.vue";
import PokemonList from "../components/PokemonList.vue";
import PokemonDetail from "../components/PokemonDetail.vue";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";

export default {
  name: "HomeView",
  components: { Headers, PokemonList, PokemonDetail },
  props: {
    loading: Boolean,
    value: {
      type: Array,
      required: true,
    },
  },
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
  <PokemonDetail v-if="currentPath?.includes('item')" :id="currentId" />
  <PokemonList v-if="currentPath === '/'" />
</template>

<style scoped></style>
