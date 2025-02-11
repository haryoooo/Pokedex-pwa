<script>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import CardSort from "../components/CardSort.vue";
import { useOutsideClick } from "../utils";

export default {
  name: "Header",
  components: { CardSort },
  props: {
    loading: Boolean,
    value: {
      type: Object,
      required: true,
    },
    setSearch: Function,
    handleFiltered: Function,
    searchValue: String,
  },
  emits: ["change", "handleFiltered", "handleSort"],
  setup(props, { emit }) {
    const route = useRoute();

    const filter = ref(route?.query?.isFiltered ?? "");
    const showFilter = ref(false);

    const setSearch = (e) => {
      emit("change", e.target.value);
    };

    const handleShowFilter = () => {
      showFilter.value = !showFilter.value;
    };

    const handleSort = (e) => {
      emit("handleSort", e);
    };

    const handleFiltered = (e, type) => {
      if (type === "remove") {
        emit("handleFiltered", e);
        return;
      } else {
        emit("handleFiltered", e);
        handleShowFilter();
      }
    };

    const showFiltered = useOutsideClick(() => {
      showFilter.value = false;
    }, showFilter);

    watchEffect(() => {
      if(!route?.params?.isFiltered){
        showFilter.value = false
      }

      filter.value = route?.query?.isFiltered;
    });

    return {
      showFiltered,
      setSearch,
      handleFiltered,
      handleSort,
      handleShowFilter,
      showFilter,
      filter,
    };
  },
};
</script>

<template>
  <div class="text-center mx-3 py-3">
    <div class="flex justify-start mb-5 gap-3">
      <div>
        <img src="../assets/images/pokeball.png" alt="pokeball" />
      </div>
      <div>
        <img src="../assets/images/pokedex.png" alt="pokedex" />
      </div>
    </div>

    <div class="flex flex-row w-full justify-between">
      <div class="w-screen">
        <div class="rounded-full bg-white mr-3">
          <div class="flex justify-start gap-2 p-2">
            <div class="self-center ml-3">
              <img src="../assets/images/search.png" alt="search-icon" />
            </div>
            <div class="cursor-pointer">
              <input
                class="min-w-min outline-none "
                type="text"
                placeholder="Search"
                :value="searchValue"
                @input="setSearch"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        ref="showFiltered"
        class="rounded-full bg-white cursor-pointer w-1/2"
      >
        <div
          v-if="filter?.length > 0"
          class="mt-2 capitalize font-bold text-sm text-[#dc211e]"
        >
          <span @click="handleShowFilter">{{ filter }}</span>
          <span
            @click="(e) => handleFiltered('', 'remove')"
            class="ml-2 mt-2 rounded-full bg-red text-sm"
            >X</span
          >
        </div>
        <div
          v-if="!filter"
          @click="handleShowFilter"
          class="mt-2 font-bold text-[#dc211e]"
        >
          #
        </div>

        <div class="absolute z-20 w-28" v-if="showFilter">
          <CardSort :handleFiltered="handleFiltered" :handleSort="handleSort" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
