<script>
import Headers from "../components/Header.vue";
import Projects from "../components/Projects.vue";
import Skills from "../components/Skills.vue";
import Footer from "../components/Footer.vue";
import Testimony from "../components/Testimony.vue";
import { useRoute } from "vue-router";
import { ref, watchEffect } from "vue";

export default {
  name: "HomeView",
  components: { Headers, Projects, Footer, Skills, Testimony },
  props: ["value", "loading"],
  setup() {
    const route = useRoute();
    const currentPath = ref(route.params.id);

    // Watch for changes in the route and update the currentPath variable
    watchEffect(() => {
      currentPath.value = route.params.id;
    });

    return {
      currentPath,
    };
  },
};
</script>

<template>
  <Headers :value="value" :loading="loading" />
  <Item v-if="currentPath" :id="currentPath" />
  <Projects v-if="!currentPath" />
</template>

<style scoped></style>
