<script>
import HomeView from "./views/HomeView.vue";
import Navbar from "./components/Navbar.vue";
import { ref } from "vue";

export default {
  name: "App",
  components: { HomeView, Navbar },
  setup() {
    const headers = ref(null);
    const loading = ref(false);

    // const getDataList = async () => {
    //   try {
    //     loading.value = true;
    //     const getData = await getDocs(collection(db, "dataList"));

    //     getData.forEach((el) => {
    //       headers.value = el?.data();
    //     });
    //     loading.value = false;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // getDataList();

    return { headers, loading };
  },
};
</script>

<template>
  <HomeView :value="headers" :loading="loading" />
</template>

<style scoped></style>
