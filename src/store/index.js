import { createStore } from "vuex";

export default createStore({
  state: {
    dataDetail: false,
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

    setDetailData(state, value) {
      state.dataDetail = value;
    },
  },

  actions: {
    setLoaderAsync({ commit }, value) {
      commit("setLoader", value);
    },
    setBgAsync({ commit }, value) {
      commit("setBg", value);
    },
    setDetailDataAsync({ commit }, value) {
      commit("setDetailData", value);
    },
  },
});
