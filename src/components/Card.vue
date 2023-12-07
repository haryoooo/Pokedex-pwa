<script>
import { useRouter } from 'vue-router';

export default {
  name: "Card",
  props: ["region"],
  setup() {
    const router = useRouter();

    const navigateToItem = (id) => {
      router.push(`/item/${id}`)
    };

    return { navigateToItem }
  }
};
</script>
<template>
  <div class="flex justify-start gap-5 hover:scale-[1.05] mt-3">
    <div
      class="border-transparent min-h-[108px] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 py-2">
      <div class="gap-5 font-normal" @click="navigateToItem(region?.id)">
        <div class="text-right pb-0 mb-0">
          <sup>
            {{ `#00${region?.id}` }}
          </sup>
        </div>
        <div class="mt-[55px] bottom-0">
          <p class="text-xs text-center">{{ region?.name }}</p>
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
