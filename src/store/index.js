import { createStore } from "vuex";

export default createStore({
  state: {
    loaderDetail: false,
    bg: "",
  },
  mutations: {
    setBg(state, value) {
      state.bg = value;
    },

    setLoader(state, value) {
      state.loaderDetail = value;
    },
  },
  actions: {
    setLoaderAsync({ commit }, value) {
      commit("setLoader", value);
    },
    setBgAsync({ commit }, value) {
      commit("setBg", value);
    },
  },
});
