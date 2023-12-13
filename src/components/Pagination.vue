<script>
export default {
  name: "Pagination",
  // setup(props) {
  //   const { data } = props;
  // },
  data() {
    return {
      rows: 20,
      currentPage: 3
    };
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
};
</script>

<template>
  <div class="overflow-auto">
    <div class="mt-3">
      <h6 class="text-center">Center alignment</h6>
      <b-pagination v-model="currentPage" :total-rows="rows" align="center"></b-pagination>
    </div>
  </div>
</template>
