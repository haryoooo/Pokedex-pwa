<script>
import { ref } from "vue";
import PokemonItem from "./PokemonItem.vue";
import Skeleton from "./Skeleton.vue";
import Pagination from "./Pagination.vue";
import { useRouter } from "vue-router";

export default {
  name: "Pokemon List",
  components: { PokemonItem, Skeleton, Pagination },
  setup() {
    const router = useRouter();
    const data = ref(Array.from({ length: 20 }));
    const pagination = ref({});
    const loading = ref(false);

    const getDataList = async (params) => {
      try {
        loading.value = true;

        const getData = await fetch(
          params ? params : "https://pokeapi.co/api/v2/pokemon/"
        );
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

        pagination.value = {
          count: dataValue?.count,
          next: dataValue?.next,
          previous: dataValue?.previous,
        };
      } catch (error) {
        loading.value = false;
        console.log(error);
      }
    };

    getDataList();

    return { data, loading, pagination, getDataList };
  },
};
</script>

<template>
  <div class="my-5 bg-white rounded-lg px-3 py-2 m-1 min-h-screen">
    <div class="flex flex-row flex-wrap">
      <div class="cursor-pointer mx-auto" v-for="val in data">
        <Skeleton v-if="loading" />
        <PokemonItem v-if="!loading" :data="val" :loading="loading" />
      </div>
      <div v-if="!loading" class="mx-auto">
        <Pagination
          :data="data"
          :loading="loading"
          :pagination="pagination"
          :getDataList="getDataList"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
