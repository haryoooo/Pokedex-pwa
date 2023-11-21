<script>
import { ref } from "vue";
import Card from "../components/Card.vue";
import { region } from "../constants/region.js";

export default {
  name: "Projects",
  components: { Card },
  setup() {
    const regions = ref(region);

    return { regions };
  },
};
</script>

<template>
  {{ console.log(regions) }}
  <div class="my-5 bg-white rounded-lg px-3 py-2 min-h-524">
    <div class="flex flex-row flex-wrap justify-center">
      <div class="text-md font-bold mt-3 mb-2">
        Which pokemon region do you want to see?
      </div>
      <div class="cursor-pointer mr-3" v-for="val in regions">
        <Card :region="val" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
