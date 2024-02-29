<script>
export default {
  name: "Alert",
  setup() {
    const handleGoBack = () => {
      window.history.back;
    };

    return {
      handleGoBack,
    };
  },
};
</script>

<template>
  <div
    v-motion
    :initial="{
      opacity: 0,
      y: 100,
    }"
    :enter="{
      opacity: 1,
      transition: {
        delay: 300,
      },
      y: 0,
    }"
    class="border-2 bg-white border-grey rounded-md min-w-[300px] min-h-[150px]"
  >
    <div class="flex flex-col text-center justify-center content-center">
      <div class="text-md font-bold mt-5">Error</div>
      <div class="text-sm my-5">No Data Found</div>
      <hr />
      <button @click="handleGoBack()" class="text-cyan-500 font-bold my-2">
        OK
      </button>
    </div>
  </div>
</template>

<style scoped></style>
