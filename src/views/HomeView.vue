<script>
import Headers from "../components/Header.vue";
import Skeleton from "../components/Skeleton.vue";
import Pagination from "../components/Pagination.vue";
import PokemonItem from "../components/PokemonItem.vue";
import PokemonDetail from "../components/PokemonDetail.vue";
import { pokemonTypes } from "../utils/pokemonTypesBg";
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect, computed, watch, onMounted, onUnmounted } from "vue";
import _debounce from "lodash/debounce";
import { useStore } from "vuex";
import { data } from "autoprefixer";

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
    const store = useStore();

    const loading = ref(false);
    const data = ref(Array.from({ length: 20 }));
    const dataTemp = ref(Array.from({ length: 20 }));
    const dataDetail = ref({});
    const isError = ref(false);

    const currentPath = ref(route?.path);
    const currentId = ref(route?.params?.id);
    const searchValue = ref("");
    const filteredValue = ref("");
    const isSorted = ref(false);
    const isContainerBg = ref("");
    const pokemonType = ref(pokemonTypes);
    const loader = ref("");

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

    const handleSort = (e) => {
      isSorted.value = !isSorted.value;

      const tempData = data.value;

      data.value = tempData?.sort((a, b) =>
        !isSorted.value
          ? b?.stats?.[1]?.base_stat - a?.stats?.[1]?.base_stat
          : a?.stats?.[1]?.base_stat - b?.stats?.[1]?.base_stat
      );
    };

    const filterByType = async (dataValue) => {
      if (dataValue === route?.query?.isFiltered) {
        data.value = dataTemp.value;
        return;
      }

      const dataToLowerCase = dataValue?.toLowerCase();

      const url = `https://pokeapi.co/api/v2/type/${dataToLowerCase}`;

      const getDataByType = await fetch(url);
      const dataJsonByType = await getDataByType.json();

      const payload = dataJsonByType?.pokemon?.map((el) => el?.pokemon);

      filteredValue.value = dataToLowerCase;

      getDataList(payload, true);
    };

    const getDataList = async (params, isFiltered) => {
      try {
        isError.value = false;

        loading.value = true;

        data.value = Array.from({ length: 20 });

        if (isFiltered && !currentPath?.value?.includes("item")) {
          const fetchData = async (url) => {
            const response = await fetch(url);

            return response.json();
          };
          const result = await Promise.all(
            params?.map((el) => fetchData(el?.url))
          );

          const filterResult = result?.sort(
            (a, b) => b?.stats?.[1]?.base_stat - a?.stats?.[1]?.base_stat
          );

          data.value = filterResult;

          dataTemp.value = filterResult;

          dataDetail.value = {};

          pagination.value = {
            count: data.value?.length,
          };

          isError.value = false;

          setTimeout(() => {
            loading.value = false;
          }, 500);
        }

        if (
          searchValue?.value?.length === 0 &&
          filteredValue?.value?.length === 0 &&
          !currentPath?.value?.includes("item")
        ) {
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

          dataTemp.value = result;

          dataDetail.value = {};

          pagination.value = {
            count: dataValue?.count,
            next: dataValue?.next,
            previous: dataValue?.previous,
          };

          isError.value = false;

          loading.value = false;
        }

        if (
          searchValue?.value?.length > 0 &&
          filteredValue?.value?.length === 0
        ) {
          loading.value = true;

          const search = searchValue.value.toLowerCase();
          // const tempData = dataTemp?.value;

          // const filterPokemon = tempData?.filter((el) => {
          //   return el?.name === searchValue.value;
          // });
          const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${search}/`;
          const responseSpecies = await fetch(urlSpecies);
          const jsonSpecies = await responseSpecies.json();
          const jsonSprites = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${jsonSpecies?.id}`
          );
          const result = await jsonSprites.json();

          loading.value = false;

          isError.value = false;

          data.value = [];

          dataDetail.value = result;
        }
      } catch (error) {
        loading.value = false;
        isError.value = true;
      }
    };

    const handlePopState = (event) => {
      // Check if the user navigated back
      if (event.state) {
        router.push(
          `/?page=${route?.query?.page}&offset=${route?.query?.offset}`
        );
      }
    };

    onMounted(() => {
      window.addEventListener("popstate", handlePopState);
    });

    onUnmounted(() => {
      window.removeEventListener("popstate", handlePopState);
    });

    watchEffect(() => {
      currentPath.value = route?.path;
      currentId.value = route?.params?.id;
      isContainerBg.value = store.state.bg;
      loader.value = store.state.loaderDetail;

      const querySearch =
        searchValue?.value?.length > 0 ? `&search=${searchValue?.value}` : "";

      const queryFilter =
        filteredValue?.value?.length > 0
          ? `&isFiltered=${filteredValue?.value}`
          : "";

      const queryBg = !currentPath.value?.includes("item")
        ? ""
        : `&isBg=${isContainerBg.value}`;

      router?.push(
        `?page=${currentPage?.value}&offset=${offset?.value}${querySearch}${queryFilter}${queryBg}`
      );

      if (filteredValue?.value?.length > 0 && searchValue?.value?.length >= 0) {
        filterByType(filteredValue.value);
      }

      if (
        !currentPath?.value?.includes("item") &&
        (route?.query?.isFiltered?.length === 0 || !route?.query?.isFiltered)
      ) {
        getDataList(route?.query?.offset);
      }

      if (searchValue?.value?.length > 0 && filteredValue?.value?.length > 0) {
        isError.value = false;

        const tempData = data?.value;

        loading.value = true;

        const dataFiltered = tempData.filter((el) =>
          el?.name?.includes(searchValue?.value.toLowerCase())
        );

        data.value = dataFiltered;

        loading.value = false;
      }
    });

    return {
      data,
      dataDetail,
      dataTemp,
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
      filterByType,
      filteredValue,
      handleSort,
      pokemonType,
      isContainerBg,
      loader,
    };
  },
};
</script>

<template>
  <div
    :class="{ importantBackground: currentPath?.includes('item') && !loader }"
    :style="{
      backgroundColor:
        currentPath?.includes('item') && !loader
          ? `${pokemonType?.[isContainerBg]}`
          : `#dc211e`,
    }"
    v-if="!currentPath?.includes('item')"
  >
    <Headers
      :value="value"
      :loading="loading"
      :search-value="searchValue"
      :filter="filteredValue"
      @handleSort="handleSort"
      @handleFiltered="filterByType"
      @change="setSearch"
    />
    <div class="my-5 bg-white rounded-lg px-1 py-2 m-1 min-h-screen">
      <div class="flex flex-row flex-wrap">
        <div
          v-if="
            !isError &&
            Object.keys(dataDetail)?.length === 0 &&
            data?.length > 0
          "
          :class="`cursor-pointer mx-auto ${loading ? 'm-1' : ''}`"
          v-for="val in data"
        >
          <Skeleton v-if="loading" />
          <PokemonItem
            v-if="!loading"
            :data="val"
            :loading="loading"
            :isContainerBg="isContainerBg"
          />
        </div>

        <div class="mx-auto">
          <div
            class="my-[40vh] text-lg self-center"
            v-if="
              isError ||
              (searchValue?.length > 0 &&
                Object.keys(dataDetail)?.length === 0 &&
                data?.length === 0)
            "
          >
            No Data Found
          </div>
          <div v-if="!isError && Object.keys(dataDetail)?.length > 0">
            <PokemonItem :data="dataDetail" :isContainerBg="isContainerBg" />
          </div>
        </div>

        <div
          v-if="
            !loading &&
            !isError &&
            pagination?.next &&
            Object.keys(data)?.length > 0
          "
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
  <div
    :class="{ importantBackground: !loader }"
    :style="{
      backgroundColor: !loader ? `${pokemonType?.[isContainerBg]}` : `#dc211e`,
    }"
    v-if="currentPath?.includes('item')"
  >
    <PokemonDetail :id="currentId" />
  </div>
</template>

<style scoped></style>
