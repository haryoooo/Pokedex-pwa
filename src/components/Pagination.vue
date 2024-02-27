<script>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

export default {
  name: "Pagination",
  components: { ChevronLeftIcon, ChevronRightIcon },
  props: {
    loading: Boolean,
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
    currentPages: Number,
  },
  emits: ["update:currentPages", "setCurrPage"], // Explicitly declare emitted events
  setup(props, { emit }) {
    const { perPage, pagination, currentPages, totalPages, paginatedData } =
      props;

    const setCurrPage = (page) => {
      const currsPage = Number(page);
      const computedOffset = page === 1 ? 0 : Number(page) * 20 - 20;

      emit("update:currentPages", currsPage); // Emit v-model update
      emit("setCurrPage", currsPage, computedOffset);
    };

    return {
      currentPage: currentPages,
      perPage,
      totalPages,
      paginatedData,
      setCurrPage,
      pagination,
    };
  },
};
</script>

<template>
  <div class="example-six">
    <vue-awesome-paginate
      :total-items="pagination?.count"
      v-model="currentPage"
      :items-per-page="perPage"
      :max-pages-shown="2"
      :on-click="setCurrPage"
    >
      <template #prev-button>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            width="12"
            height="12"
            viewBox="0 0 24 24"
          >
            <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
          </svg>
        </span>
      </template>

      <template #next-button>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            width="12"
            height="12"
            viewBox="0 0 24 24"
          >
            <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
          </svg>
        </span>
      </template>
    </vue-awesome-paginate>
  </div>
</template>

<style>
textarea:focus,
input:focus {
  outline: none;
}

.example-six .pagination-container {
  margin-top: 30px;
  column-gap: 10px;
  align-items: center;
}
.example-six .paginate-buttons {
  height: 35px;
  width: 35px;
  cursor: pointer;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  color: black;
}

.example-six .back-button,
.example-six .next-button {
  background-color: #dc211e;
  color: white;
  border-radius: 8px;
  height: 45px;
  width: 45px;
}
.example-six .active-page {
  text-align: center;
  background-color: #e5e5e5;
}
.example-six .paginate-buttons:hover {
  background-color: #f5f5f5;
}
.example-six .active-page:hover {
  background-color: #e5e5e5;
}

.example-six .back-button svg {
  margin: 0px auto;
  text-align: center;
  transform: rotate(180deg) translateY(-2px);
}
.example-six .next-button svg {
  margin: 0px auto;
  transform: translateY(2px);
}

.example-six .back-button:hover,
.example-six .next-button:hover {
  background-color: #db465f;
}

.example-six .back-button:active,
.example-six .next-button:active {
  background-color: #db465f;
}
</style>
