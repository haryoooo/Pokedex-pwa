<script>
import { useRouter, useRoute } from "vue-router";
import Skeleton from "./Skeleton.vue";
import { ref, watchEffect } from "vue";
import { useStore } from "vuex";

export default {
  name: "Pokemon Item",
  components: { Skeleton },
  props: {
    loading: Boolean,
    data: {
      type: Object,
      required: true,
    },
    searchValue: String,
  },
  setup(props) {
    const { data, loading, searchValue } = props;

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const id = ref(data?.id);
    const order = ref();

    const convertZero = (value) => {
      let strNumber;

      if (value > 0 && value < 10) {
        strNumber = `#00${value}`;
      }
      if (value > 9 && value < 100) {
        strNumber = value > 9 && value < 100 ? `#0${value}` : `#${value}`;
      }
      order.value = strNumber;
    };

    const navigateToDetail = (type, data) => {
      const types = data?.types?.[0].type?.name;
      const queryBg = types === null && !types ? "" : `&isBg=${types}`;

      setTimeout(() => {
        store.dispatch("setBgAsync", types);
      }, 500);

      router.push(
        `/${type}/${data?.name}?${
          searchValue
            ? `search=${searchValue}`
            : `page=${route?.query?.page}&offset=${route?.query?.offset}${queryBg}
        `
        }`
      );
    };

    watchEffect(() => {
      id.value = data?.id;

      convertZero(id);
    });

    return {
      navigateToDetail,
      convertZero,
      order,
      loading,
    };
  },
};
</script>
<template>
  <div class="flex justify-start gap-5 hover:scale-[1.05] mt-3">
    <Skeleton v-if="loading" />

    <div
      v-if="!loading && Object.keys(data)?.length > 0"
      class="border-transparent min-h-[108px] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 py-2 cursor-pointer"
    >
      <div @click="navigateToDetail('item', data)">
        <div class="text-right pb-0 mb-0">
          <sup class="font-semibold">
            {{ order }}
          </sup>
        </div>

        <div class="text-center mx-auto">
          <img
            :src="
              data?.sprites?.other?.['official-artwork']?.front_default ||
              'fallback-image-url'
            "
            width="100"
            alt="pokemon-img"
          />
        </div>
        <div class="bottom-0 max-w-[100px]">
          <p class="text-xs text-center capitalize font-semibold truncate">
            {{ data?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
