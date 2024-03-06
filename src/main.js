import "./assets/main.css";
import "./assets/tailwind.css";
import { MotionPlugin } from "@vueuse/motion";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueAwesomePaginate from "vue-awesome-paginate";

// import the necessary css file
import "vue-awesome-paginate/dist/style.css";

const app = createApp(App);

app.use(router).use(MotionPlugin).use(VueAwesomePaginate).use(store);

app.mount("#app");
