<script>
import { ref } from "vue";
import PokemonItem from "./PokemonItem.vue";
import Pagination from "./Pagination.vue";
import { useRouter } from "vue-router";

export default {
  name: "Pokemon List",
  components: { PokemonItem, Pagination },
  setup() {
    const router = useRouter();
    const data = ref(Array.from({ length: 20 }));
    const loading = ref(false);

    const navigateToDetail = (id) => {
      router.push(`/item/${id}`);
    };

    const getDataList = async () => {
      try {
        loading.value = true;

        const getData = await fetch("https://pokeapi.co/api/v2/pokemon/");
        const dataValue = await getData.json();

        const fetchData = async (url) => {
          const response = await fetch(url);
          return response.json();
        };
        const result = await Promise.all(
          dataValue?.results?.map((el) => fetchData(el?.url))
        );

        loading.value = false;

        data.value = result;
      } catch (error) {
        loading.value = false;
        console.log(error);
      }
    };

    getDataList();

    return { data, loading };
  },
};
</script>

<template>
  {{ console.log(loading, data) }}
  <div class="my-5 bg-white rounded-lg px-3 py-2 m-1 min-h-screen">
    <div class="flex flex-row flex-wrap">
      <div class="cursor-pointer mx-auto" v-for="val in data">
        <PokemonItem :data="val" :loading="loading" />
      </div>
      <div class="mx-auto">
        <Pagination :data="data" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
