<script>
import { useRouter } from "vue-router";
import Skeleton from "./Skeleton.vue";
import { ref, watchEffect } from "vue";

export default {
  name: "Pokemon Item",
  components: { Skeleton },
  props: {
    loading: Boolean,
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { data, loading } = props;

    const router = useRouter();
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

    const navigateToDetail = (type, id) => {
      router.push(`/${type}/${id}`);
    };

    watchEffect(() => {
      convertZero(data?.id);
    });

    return { navigateToDetail, convertZero, order, loading };
  },
};
</script>
<template>
  <div class="flex justify-start gap-5 hover:scale-[1.05] mt-3">
    <Skeleton v-if="loading" />

    <div v-if="!loading"
      class="border-transparent min-h-[108px] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 py-2">
      <div @click="navigateToDetail('item', data?.name)">
        <div class="text-right pb-0 mb-0">
          <sup class="font-semibold">
            {{ order }}
          </sup>
        </div>

        <div class="text-center mx-auto">
          <img :src="data?.sprites?.other?.['official-artwork']?.front_default ||
            'fallback-image-url'
            " width="100" alt="pokemon-img" />
        </div>
        <div class="bottom-0">
          <p class="text-xs text-center capitalize font-semibold">
            {{ data?.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>

<!-- <h1 class="text-xl font-bold mt-1">{{ element?.title }}</h1>
        <h4 class="text-md text-[#B0B0B0] mt-3">
          {{ `This is ${element?.title} projects` }}
        </h4>
        <div class="flex flex-row justify-start my-3">
          <div
            v-for="(el, index) in element?.technology"
            :key="index"
            class="bg-[#fbfbfb] rounded-lg mr-3"
          >
            <div class="border-transparent">
              <img width="30" :src="el" alt="tech-skill" />
            </div>
          </div>
        </div> -->
