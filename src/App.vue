<script>
import HomeView from "./views/HomeView.vue";
import Navbar from "./components/Navbar.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: { HomeView, Navbar },
  setup() {
    const headers = ref(null);
    const loading = ref(false);

    return { headers, loading };
  },
};
</script>

<template>
  <HomeView :value="headers" :loading="loading" />
</template>

<style scoped></style>
