<script>
import Headers from "../components/Header.vue";
import Skeleton from "../components/Skeleton.vue";
import Pagination from "../components/Pagination.vue";
import PokemonItem from "../components/PokemonItem.vue";
import PokemonDetail from "../components/PokemonDetail.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect, computed } from "vue";
import _debounce from "lodash/debounce";

export default {
  name: "HomeView",
  components: { Headers, PokemonItem, PokemonDetail, Pagination, Skeleton },
  props: {
    loading: Boolean,
    value: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const loading = ref(false);
    const data = ref(Array.from({ length: 20 }));
    const dataDetail = ref({});
    const isError = ref(false);

    const currentPath = ref(route?.path);
    const currentId = ref(route?.params?.id);
    const searchValue = ref("");

    const pagination = ref({});
    const currentPage = ref(route?.query?.page ?? 1);
    const offset = ref(route?.query?.offset ?? 0);
    const perPage = 20;

    const setCurrentPage = (value, valueOffset) => {
      currentPage.value = value;
      offset.value = valueOffset;
    };

    const setSearch = _debounce((value) => {
      searchValue.value = value;
    }, 300);

    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * perPage;
      const endIndex = startIndex + perPage;
      return data?.value?.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(pagination?.count / perPage));

    const getDataList = async (params) => {
      try {
        loading.value = true;

        data.value = Array.from({ length: 20 });

        if (searchValue?.value?.length === 0) {
          const getData = await fetch(
            `https://pokeapi.co/api/v2/pokemon/?offset=${params}&limit=20`
          );
          const dataValue = await getData.json();

          const fetchData = async (url) => {
            const response = await fetch(url);

            return response.json();
          };
          const result = await Promise.all(
            dataValue?.results?.map((el) => fetchData(el?.url))
          );

          data.value = result;

          loading.value = false;

          isError.value = false;

          dataDetail.value = {};

          pagination.value = {
            count: dataValue?.count,
            next: dataValue?.next,
            previous: dataValue?.previous,
          };
        }

        if (searchValue?.value?.length > 0) {
          loading.value = true;

          const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${searchValue?.value}/`;
          const responseSpecies = await fetch(urlSpecies);
          const jsonSpecies = await responseSpecies.json();
          const jsonSprites = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${jsonSpecies?.id}`
          );
          const result = await jsonSprites.json();

          loading.value = false;

          isError.value = false;

          data.value = [];

          dataDetail.value = { ...result, ...jsonSpecies };
        }
      } catch (error) {
        loading.value = false;
        isError.value = true;
      }
    };

    watchEffect(() => {
      currentPath.value = route?.path;
      currentId.value = route?.params?.id;

      const query =
        searchValue?.value?.length > 0 ? `&search=${searchValue?.value}` : "";

      router?.push(
        `?page=${currentPage?.value}&offset=${offset?.value}${query}`
      );

      if (!currentPath?.value?.includes("item")) {
        getDataList(route?.query?.offset);
      }
    });

    return {
      data,
      dataDetail,
      loading,
      isError,
      searchValue,
      setSearch,
      setCurrentPage,
      currentPath,
      currentId,
      currentPage,
      totalPages,
      pagination,
      paginatedData,
      perPage,
    };
  },
};
</script>

<template>
  <div v-if="!currentPath?.includes('item')">
    <Headers
      :value="value"
      :loading="loading"
      :search-value="searchValue"
      @change="setSearch"
    />
    <div class="my-5 bg-white rounded-lg px-3 py-2 m-1 min-h-screen">
      <div class="flex flex-row flex-wrap">
        <div
          v-if="!isError && Object.keys(dataDetail)?.length === 0"
          :class="`cursor-pointer mx-auto ${loading ? 'm-1' : ''}`"
          v-for="val in data"
        >
          <Skeleton v-if="loading" />
          <PokemonItem v-if="!loading" :data="val" :loading="loading" />
        </div>

        <div class="mx-auto">
          <div
            class="my-[40vh] text-lg self-center"
            v-if="
              isError ||
              (searchValue?.value?.length > 0 &&
                Object.keys(dataDetail)?.length === 0)
            "
          >
            No Data Found
          </div>
          <div
            v-if="!isError && Object.keys(dataDetail)?.length > 0"
          >
            <PokemonItem :data="dataDetail" />
          </div>
        </div>

        <div
          v-if="!loading && !isError && Object.keys(dataDetail)?.length === 0"
          class="mx-auto"
        >
          <Pagination
            :data="data"
            :loading="loading"
            :paginatedData="paginatedData"
            :pagination="pagination"
            :currentPages="currentPage"
            :totalPages="totalPages"
            :perPage="perPage"
            v-model:currentPage="currentPage"
            @setCurrPage="setCurrentPage"
          />
        </div>
      </div>
    </div>
  </div>
  <PokemonDetail v-if="currentPath?.includes('item')" :id="currentId" />
</template>

<style scoped></style>
