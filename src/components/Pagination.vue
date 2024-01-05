<script>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { ref, computed } from "vue";

export default {
  name: "Pagination",
  components: { ChevronLeftIcon, ChevronRightIcon },
  props: {
    loading: Boolean,
    getDataList: {
      type: Function,
    },
    pagination: {
      type: Object,
    },
    data: {
      type: Array,
      required: true,
    },
    perPage: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    const { data, perPage, pagination, getDataList } = props;

    const currentPage = ref(1);

    const totalPages = computed(() => Math.ceil(data?.length / perPage));

    const paginatedData = computed(() => {
      const startIndex = (currentPage.value - 1) * perPage;
      const endIndex = startIndex + perPage;
      return data?.slice(startIndex, endIndex);
    });

    const setCurrentPage = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        currentPage.value = pageNumber;
      }
    };

    return {
      getDataList,
      currentPage,
      totalPages,
      paginatedData,
      setCurrentPage,
      pagination,
    };
  },
};
</script>

<template>
  <!-- {{ console.log(currentPage, totalPages, paginatedData, pagination) }} -->
  <div
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="#"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Previous</a
      >
      <a
        href="#"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Next</a
      >
    </div>

    <div>
      <nav
        class="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <a
          href="#"
          @click="getDataList(pagination?.previous)"
          class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </a>
        <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
        <a
          href="#"
          aria-current="page"
          class="relative z-10 inline-flex items-center bg-red-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >1</a
        >
        <a
          href="#"
          @click="getDataList(pagination?.next)"
          class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </a>
      </nav>
    </div>
  </div>
</template>
