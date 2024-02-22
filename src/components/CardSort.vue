<script>
import { useRoute } from "vue-router";
import { types } from "../constants/types";

export default {
  name: "CardSort",
  props: {
    handleFiltered: Function,
  },
  setup(props) {
    const { handleFiltered } = props;
    const route = useRoute();

    return {
      types,
      route,
      handleFiltered,
    };
  },
};
</script>
<template>
  <div class="border">
    <h4 class="headerSort">Sort By:</h4>

    <div class="borderSelection">
      <div class="">
        <h4>Type:</h4>
        <hr />
        <div v-for="pokemonType in types">
          <div class="flex justify-start mx-2">
            <input
              @change="(e) => handleFiltered(e.target.value)"
              type="radio"
              :checked="(pokemonType.type).toLowerCase() === route?.query?.isFiltered"
              :value="pokemonType.type"
              alt="type-pokemon"
            />
            <label style="text-transform: capitalize; margin-left: 5px">
              {{ pokemonType?.type }}</label
            >
          </div>
        </div>
      </div>

      <!-- <div class="">
        <h4>Most Damage :</h4>
      </div> -->
    </div>
  </div>
</template>
<style scoped>
.border {
  margin-top: 10px;
  border: 1px solid white;
  border-radius: 12px;
  z-index: 9999;
  background-color: #dc0a2d;
}

.headerSort {
  font-weight: 700;
  font-size: 12px;
  color: white;
}

.borderSelection {
  border: 1px solid white;
  margin: 5px 5px 10px 5px;
  border-radius: 12px;
  font-size: 13px;
  background-color: white;
}
</style>
