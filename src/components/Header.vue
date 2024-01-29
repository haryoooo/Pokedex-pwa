<script>
export default {
  name: "Header",
  props: {
    loading: Boolean,
    value: {
      type: Object,
      required: true,
    },
    setSearch: Function,
    searchValue: String,
  },
  emits: ["change"],
  setup(props, { emit }) {
    const setSearch = (e) => {
      emit("change", e.target.value);
    };

    return {
      setSearch,
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
                class="min-w-min outline-none"
                type="text"
                placeholder="Search"
                :value="searchValue"
                @input="setSearch"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-full bg-white cursor-pointer">
        <div class="mt-2 font-bold text-[#dc0a2d] mx-3">#</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
