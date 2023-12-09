<script>
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";

export default {
  name: "Item",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const currentPath = ref(route?.params?.id);
    const data = ref();
    const order = ref();

    const goBack = () => {
      router.go(-1);
    };

    const convertZero = (id) => {
      let strNumber;

      if (id > 0 && id < 10) {
        strNumber = `#00${id}`;
      }

      if (id > 9 && id < 100) {
        strNumber = id > 9 && id < 100 ? `#0${id}` : `#${id}`;
      }

      order.value = strNumber;
    };

    const getDataDetail = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon/${route?.params?.id}`;

      const response = await fetch(url);
      const json = await response.json();

      data.value = json;

      convertZero(json?.id);
    };

    watchEffect(() => {
      currentPath.value = route?.params?.id;
    });

    getDataDetail();

    return {
      currentPath,
      convertZero,
      getDataDetail,
      goBack,
      order,
      data,
    };
  },
};
</script>
<template>
  {{ console.log(data) }}
  <div class="container flex flex-row justify-between p-3">
    <div class="flex flex-row">
      <div class="cursor-pointer" @click="goBack()">
        <img src="../assets//images//arrow.png" alt="arrow" />
      </div>

      <div>
        <h3 class="text-lg mt-1 ml-3 text-white text-center capitalize">
          {{ currentPath }}
        </h3>
      </div>
    </div>

    <div class="text-right mt-2">
      <h3>
        {{ order }}
      </h3>
    </div>
  </div>
</template>
<style scoped>
.container {
  background-color: #74cb48 !important;
  color: white;
}
</style>
