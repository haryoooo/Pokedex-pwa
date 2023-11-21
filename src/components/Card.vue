<script>
export default {
  name: "Card",
  props: ["region"],
};
</script>
<template>
  <div class="flex justify-start gap-5 hover:scale-[1.05] mt-3">
    <div
      class="border-transparent w-24 border-[#B0B0B0] bg-white shadow-custom rounded-lg px-5 py-2"
    >
      <div class="gap-5 font-normal">
        <div class="text-right pb-0 mb-0">
          <sup>
            {{ `#00${region?.id}` }}
          </sup>
        </div>
        <div class="mb-3">
          <p class="text-xs">{{ region?.name }}</p>
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
