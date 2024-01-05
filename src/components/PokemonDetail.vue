<script>
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";

export default {
  name: "Pokemon Detail",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const loading = ref(false);
    const currentPath = ref(route?.params?.id);
    const data = ref();
    const order = ref();
    const progress = ref(0);

    const goBack = () => {
      router.push(`/`);
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
      loading.value = true;

      const url = `https://pokeapi.co/api/v2/pokemon/${route?.params?.id}`;

      const response = await fetch(url);
      const json = await response.json();

      const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${json?.id}/`;
      const responseSpecies = await fetch(urlSpecies);
      const jsonSpecies = await responseSpecies.json();

      data.value = { ...json, detail: jsonSpecies };

      loading.value = false;

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
      loading,
      goBack,
      order,
      data,
      progress,
    };
  },
};
</script>
<template>
  <div
    v-if="loading"
    class="flex justify-center bg-white text-lg text-black content-center min-h-[100vh] items-center mx-auto"
  >
    <div>Loading...</div>
  </div>

  <div v-if="!loading" :class="data?.types?.[0]?.type?.name">
    <div class="flex flex-row justify-between p-3">
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

      <div class="text-right text-white mt-2">
        <h3>
          {{ order }}
        </h3>
        <div class="cursor-pointer opacity-10 position-absolute">
          <img src="../assets//images//pokeball-detail.png" alt="arrow" />
        </div>
      </div>
    </div>

    <div
      class="border-transparent min-h-[108px] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 py-2 mx-2"
    >
      <div
        class="absolute top-60 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div class="text-center">
          <img
            v-motion
            :initial="{
              opacity: 0,
              y: 100,
            }"
            :enter="{
              opacity: 1,
              transition: {
                delay: 500,
              },
              y: 0,
            }"
            :src="
              data?.sprites?.other?.['official-artwork']?.front_default ||
              'fallback-image-url'
            "
            width="250"
            alt="pokemon-img"
          />
        </div>
      </div>

      <div class="mt-[100px] capitalize text-white mx-auto">
        <div class="flex flex-row justify-center gap-2">
          <div class="place-items-center" v-for="value in data?.types">
            <div
              :class="[
                'border rounded-lg font-medium capitalize p-1',
                value?.type?.name,
              ]"
            >
              {{ value?.type?.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="capitalize text-white mx-auto">
        <div class="mt-5 text-lg">
          <div
            :class="[
              'capitalize',
              'text-center',
              'font-semibold',
              'color-' + data?.types?.[0]?.type?.name,
            ]"
          >
            About
          </div>
        </div>
      </div>

      <div class="flex justify-between mx-5">
        <div class="flex flex-row self-center">
          <div>
            <img src="../assets//images//weight.png" width="25" alt="weight" />
          </div>
          <div class="ml-2">{{ data?.weight / 10 + " kg" }}</div>
        </div>
        <div class="vertical-line"></div>
        <div class="flex flex-row self-center">
          <div>
            <img src="../assets//images//measure.png" width="25" alt="weight" />
          </div>
          <div class="ml-2">{{ data?.height / 10 + " m" }}</div>
        </div>
        <div class="vertical-line"></div>
        <div class="flex flex-col">
          <div class="capitalize ml-2" v-for="value in data?.abilities">
            <div>
              {{ value?.ability?.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-row justify-between mx-10 top-0">
        <div class="text-center text-[12px] text-[#666666] font-semibold">
          Weight
        </div>
        <div class="text-center text-[12px] text-[#666666] font-semibold">
          Height
        </div>
        <div class="text-center text-[12px] text-[#666666] font-semibold">
          Moves
        </div>
      </div>

      <div class="text-left m-5 text-sm text-justify">
        {{ data?.detail?.flavor_text_entries?.[0]?.flavor_text }}
      </div>

      <div>
        <div>
          <h3
            :class="[
              'text-lg',
              'capitalize',
              'text-center',
              'font-semibold',
              'color-' + data?.types?.[0]?.type?.name,
            ]"
          >
            Base Stats
          </h3>
        </div>

        <div class="flex flex-row justify-start">
          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs my-5 mx-3"
          >
            <div
              :class="[
                'capitalize',
                'border-r-2 border-solid border-gray-300 ',
                'color-' + data?.types?.[0]?.type?.name,
              ]"
              v-for="value in data?.stats"
            >
              <div class="font-bold mr-3">
                {{ value?.stat?.name }}
              </div>
            </div>
          </div>

          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs my-5"
          >
            <div v-for="value in data?.stats">
              <div class="font-bold">
                {{
                  value?.base_stat > 9 && value?.base_stat < 100
                    ? `0${value?.base_stat}`
                    : `${value?.base_stat}`
                }}
              </div>
            </div>
          </div>

          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs my-7 mx-3"
          >
            <div v-for="value in data?.stats">
              <div class="progress-container">
                <div
                  :class="['progress-bar', data?.types?.[0]?.type?.name]"
                  :style="{
                    maxWidth: `${value?.base_stat}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  color: white;
}

.grass {
  background-color: #74cb48 !important;
}

.bug {
  background-color: #a8b820 !important;
}

.ice {
  background-color: #98d8d8 !important;
}

.poison {
  background-color: #a040a0 !important;
}

.normal {
  background-color: #a8a878 !important;
}

.psychic {
  background-color: #f85888 !important;
}

.fire {
  background-color: #f08030 !important;
}

.dragon {
  background-color: #7038f8 !important;
}

.electric {
  background-color: #f8d030 !important;
}

.water {
  background-color: #6890f0 !important;
}

.flying {
  background-color: #a890f0 !important;
}

.color-grass {
  color: #74cb48 !important;
}

.color-bug {
  color: #a8b820 !important;
}

.color-ice {
  color: #98d8d8 !important;
}

.color-poison {
  color: #a040a0 !important;
}

.color-normal {
  color: #a8a878 !important;
}

.color-psychic {
  color: #f85888 !important;
}

.color-fire {
  color: #f08030 !important;
}

.color-dragon {
  color: #7038f8 !important;
}

.color-electric {
  color: #f8d030 !important;
}

.color-water {
  color: #6890f0 !important;
}

.color-flying {
  color: #a890f0 !important;
}

.vertical-line {
  border-left: 2px solid #e0e0e0;
  /* Adjust color and thickness as needed */
  height: 8vh;
  /* Adjust height as needed */
  margin-left: 20px;
  /* Adjust left margin as needed */
}

.vertical-line-sm {
  border-left: 2px solid #e0e0e0;
  /* Adjust color and thickness as needed */
  height: 2vh;
  /* Adjust height as needed */
}

.progress-container {
  min-width: 200px;
  height: 7px;
  /* Adjust the height as needed */
  background-color: #f1f1f1;
  overflow: hidden;
  border-radius: 12px;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
  /* Animation duration and easing */
  animation: progressAnimation 1s ease;
}

@keyframes progressAnimation {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}
</style>
