<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import debounce from "lodash/debounce";
import { pokemonTypes } from "../utils/pokemonTypesBg";
import Headers from "../components/Header.vue";
import Skeleton from "../components/Skeleton.vue";
import Pagination from "../components/Pagination.vue";
import PokemonItem from "../components/PokemonItem.vue";
import PokemonDetail from "../components/PokemonDetail.vue";
import { pokemonApi, ITEMS_PER_PAGE } from "../utils/pokemonAPI";

// Props
const props = defineProps({
  loading: Boolean,
  value: {
    type: Array,
    required: true,
  },
});

// Composables
const route = useRoute();
const router = useRouter();
const store = useStore();

// State
const state = ref({
  loading: false,
  data: Array.from({ length: ITEMS_PER_PAGE }),
  dataTemp: Array.from({ length: ITEMS_PER_PAGE }),
  dataDetail: {},
  isError: false,
  currentPath: route?.path,
  currentId: route?.params?.id,
  searchValue: "",
  filteredValue: "",
  isSorted: false,
  isContainerBg: "",
  pagination: {},
  currentPage: Number(route?.query?.page ?? 1),
  offset: Number(route?.query?.offset ?? 0),
});

// Computed
const paginatedData = computed(() => {
  const startIndex = (state.value.currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return state.value.data?.slice(startIndex, endIndex);
});

const totalPages = computed(() =>
  Math.ceil(state.value.pagination?.count / ITEMS_PER_PAGE)
);

const containerStyles = computed(() => ({
  backgroundColor:
    state?.value?.currentPath?.includes("item") && !store.state.loaderDetail
      ? pokemonTypes[state.value.isContainerBg]
      : "#dc211e",
}));

// Methods
const setCurrentPage = (value, valueOffset) => {
  state.value.currentPage = value;
  state.value.offset = valueOffset;
};

const setSearch = debounce((value) => {
  state.value.searchValue = value;
}, 300);

const handleSort = () => {
  state.value.isSorted = !state.value.isSorted;
  state.value.data = [...state.value.data].sort((a, b) =>
    state.value.isSorted
      ? a?.stats?.[1]?.base_stat - b?.stats?.[1]?.base_stat
      : b?.stats?.[1]?.base_stat - a?.stats?.[1]?.base_stat
  );
};

const filterByType = async (dataValue) => {
  if (dataValue === route?.query?.isFiltered) {
    state.value.data = state.value.dataTemp;
    return;
  }

  if(!dataValue){
    state.value.filteredValue = "";
    return
  }
  
  try {
    state.value.loading = true;
    const dataJson = await pokemonApi.fetchPokemonByType(
      dataValue.toLowerCase()
    );
    const pokemonList = await Promise.all(
      dataJson.pokemon.map(({ pokemon }) =>
        pokemonApi.fetchPokemonDetail(pokemon.url)
      )
    );

    state.value.filteredValue = dataValue.toLowerCase();
    state.value.data = pokemonList.sort(
      (a, b) => b?.stats?.[1]?.base_stat - a?.stats?.[1]?.base_stat
    );
    state.value.dataTemp = [...state.value.data];
    state.value.dataDetail = {};
    state.value.pagination = { count: state.value.data.length };
  } catch (error) {
    state.value.isError = true;
  } finally {
    state.value.loading = false;
  }
};

const getDataList = async (offset, isFiltered = false) => {
  try {
    state.value.loading = true;
    state.value.isError = false;
    state.value.data = Array.from({ length: ITEMS_PER_PAGE });

    if (state.value.searchValue && !state.value.filteredValue) {
      const result = await pokemonApi.fetchPokemonByName(
        state.value.searchValue.toLowerCase()
      );
      state.value.dataDetail = result;
      state.value.data = [];
      return;
    }

    if (!isFiltered && !state.value.searchValue && !state.value.filteredValue) {
      const data = await pokemonApi.fetchPokemonList(offset);
      const pokemonDetails = await Promise.all(
        data.results.map((pokemon) =>
          pokemonApi.fetchPokemonDetail(pokemon.url)
        )
      );

      state.value.data = pokemonDetails;
      state.value.dataTemp = [...pokemonDetails];
      state.value.dataDetail = {};
      state.value.pagination = {
        count: data.count,
        next: data.next,
        previous: data.previous,
      };
    }
  } catch (error) {
    state.value.isError = true;
  } finally {
    state.value.loading = false;
  }
};

// Router handling
const handlePopState = (event) => {
  if (event.state) {
    router.push(`/?page=${route?.query?.page}&offset=${route?.query?.offset}`);
  }
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("popstate", handlePopState);
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});

// Watchers
watch(
  () => [
    route.path,
    route.params.id,
    store.state.bg,
    state.value.searchValue,
    state.value.filteredValue,
    state.value.currentPage,
  ],
  async ([newPath, newId, newBg, newSearch, newFilter, newPage]) => {
    state.value.currentPath = newPath;
    state.value.currentId = newId;
    state.value.isContainerBg = store.state.bg;

    const queryParams = new URLSearchParams({
      page: state.value.currentPage,
      offset: state.value.offset,
      ...(newSearch && { search: newSearch }),
      ...(newFilter && { isFiltered: newFilter }),
      ...(newPath?.includes("item") && { isBg: state.value.isContainerBg }),
    });

    router.push(`?${queryParams.toString()}`);

    if (newFilter && !newPath?.includes("item")) {
      await filterByType(newFilter);
    } else if (!newPath?.includes("item") && !route?.query?.isFiltered) {
      await getDataList(route?.query?.offset);
    }

    if (newSearch && newFilter) {
      state.value.data = state.value.data.filter((el) =>
        el?.name?.includes(newSearch.toLowerCase())
      );
    }
  },
  { deep: true }
);
</script>

<template>
  <div :style="containerStyles">
    <template v-if="!state.currentPath?.includes('item')">
      <Headers
        :value="value"
        :loading="state.loading"
        :search-value="state.searchValue"
        :filter="state.filteredValue"
        @handleSort="handleSort"
        @handleFiltered="filterByType"
        @change="setSearch"
      />

      <div class="mt-5 bg-white rounded-lg px-1 py-2 mx-1 min-h-screen">
        <div class="flex flex-row flex-wrap">
          <!-- Loading state -->
          <template
            v-if="
              !state.isError &&
              Object.keys(state.dataDetail)?.length === 0 &&
              state.data?.length > 0
            "
          >
            <div
              v-for="val in state.data"
              :key="val?.id"
              :class="`cursor-pointer mx-auto ${state.loading ? 'm-1' : ''}`"
            >
              <Skeleton v-if="state.loading" />
              <PokemonItem
                v-else
                :data="val"
                :loading="state.loading"
                :isContainerBg="state.isContainerBg"
              />
            </div>
          </template>

          <!-- Error or No Results -->
          <div class="mx-auto">
            <div
              v-if="
                state.isError ||
                (state.searchValue?.length > 0 &&
                  Object.keys(state.dataDetail)?.length === 0 &&
                  state.data?.length === 0)
              "
              class="my-[40vh] text-lg self-center"
            >
              No Data Found
            </div>

            <!-- Pokemon Detail -->
            <PokemonItem
              v-if="!state.isError && Object.keys(state.dataDetail)?.length > 0"
              :data="state.dataDetail"
              :isContainerBg="state.isContainerBg"
            />
          </div>

          <!-- Pagination -->
          <div
            v-if="
              !state.loading &&
              !state.isError &&
              state.pagination?.next &&
              Object.keys(state.data)?.length > 0
            "
            class="mx-auto"
          >
            <Pagination
              :data="state.data"
              :loading="state.loading"
              :paginatedData="paginatedData"
              :pagination="state.pagination"
              :currentPages="state.currentPage"
              :totalPages="totalPages"
              :perPage="ITEMS_PER_PAGE"
              v-model:currentPage="state.currentPage"
              @setCurrPage="setCurrentPage"
            />
          </div>
        </div>
      </div>
    </template>

    <PokemonDetail v-else :id="state.currentId" />
  </div>
</template>

<style></style>
