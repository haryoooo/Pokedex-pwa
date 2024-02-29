<script>
import { useRoute, useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
import Alert from "./Alert.vue";

export default {
  name: "Pokemon Detail",
  components: { Alert },
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
    const audioPlayer = ref(null);
    const isClicked = ref(false);

    const isError = ref(false);

    const goBack = () => {
      router.push(
        `/?page=${route?.query?.page}&offset=${route?.query?.offset}`
      );
    };

    const playAudio = () => {
      isClicked.value = true;
      audioPlayer.value.play();
      setTimeout(() => {
        isClicked.value = false;
      }, 1000);
    };

    const convertZero = (id) => {
      let strNumber;

      if (id > 0 && id < 10) {
        strNumber = `#00${id}`;
      }

      if (id > 9 && id < 100) {
        strNumber = id > 9 && id < 100 ? `#0${id}` : `#${id}`;
      }

      if (id > 100) {
        strNumber = `#${id}`;
      }

      order.value = strNumber;
    };

    const getDataDetail = async () => {
      try {
        isError.value = false;
        loading.value = true;

        let evolution = {};

        const fetchPokemonData = async (url) => {
          const response = await fetch(url);

          if (response?.status !== 200) return "Error";
          return response.json();
        };

        const batchFetchEvolution = async (urls) => {
          const filterUrls = urls?.filter((el) => !el?.includes("undefined"));

          const responses = await Promise.allSettled(
            filterUrls.map(fetchPokemonData)
          );

          return responses.map((response) => ({ ...response?.value }));
        };

        const fetchEvolutionChain = async (url) => {
          const response = await fetch(url);
          return response.json();
        };

        const url = `https://pokeapi.co/api/v2/pokemon/${route?.params?.id}`;
        const json = await fetchPokemonData(url);

        const urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${json?.id}/`;
        const jsonSpecies = await fetchPokemonData(urlSpecies);

        if (jsonSpecies === "Error") {
          loading.value = false;
          data.value = { ...json, detail: {}, evolution: [] };
          convertZero(json?.id);
          return;
        }

        if (jsonSpecies) {
          const evolutionSpecies = await fetchEvolutionChain(
            jsonSpecies?.evolution_chain?.url
          );

          let evolutionUrls = [
            `https://pokeapi.co/api/v2/pokemon/${evolutionSpecies?.chain?.species?.name}`,
            `https://pokeapi.co/api/v2/pokemon/${evolutionSpecies?.chain.evolves_to?.[0]?.species?.name}`,
            `https://pokeapi.co/api/v2/pokemon/${evolutionSpecies?.chain.evolves_to?.[0]?.evolves_to?.[0]?.species?.name}`,
          ];

          if (
            evolutionSpecies?.chain.evolves_to?.[0]?.evolves_to?.[0]?.length > 0
          ) {
            evolutionUrls = [
              `https://pokeapi.co/api/v2/pokemon/${evolutionSpecies?.chain?.species?.name}`,
              `https://pokeapi.co/api/v2/pokemon/${evolutionSpecies?.chain.evolves_to?.[0]?.species?.name}`,
            ];
          }

          const evolutionDetails = await batchFetchEvolution(evolutionUrls);

          const filteredEvolution =
            typeof evolutionDetails?.[2] === "object" &&
            Object?.keys(evolutionDetails?.[2])?.length === 0
              ? evolutionDetails?.slice(0, -1)
              : evolutionDetails;

          evolution = filteredEvolution;
        }

        data.value = { ...json, detail: jsonSpecies, evolution };

        loading.value = false;

        convertZero(json?.id);
      } catch (error) {
        isError.value = true;
        loading.value = false;
      }
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
      isError,
      playAudio,
      audioPlayer,
      isClicked,
    };
  },
};
</script>
<template>
  <div
    v-if="loading"
    class="flex justify-center text-lg text-white content-center min-h-screen items-center mx-auto"
  >
    <div class="animate-bounce font-bold">
      <img src="../assets//images//poke-loader.gif" alt="arrow" />
    </div>
  </div>

  <div
    v-if="isError"
    class="flex justify-center text-lg text-black content-center items-center min-h-[100vh] items-center mx-auto"
  >
    <Alert />
  </div>

  <div v-if="!loading && !isError" :class="data?.types?.[0]?.type?.name">
    <div class="flex flex-row justify-between p-3">
      <div class="flex flex-row">
        <div class="cursor-pointer" @click="goBack()">
          <img src="../assets//images//arrow.png" alt="arrow" />
        </div>

        <div>
          <h3 class="text-lg mt-1 ml-3 text-white capitalize">
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
      :class="
        (typeof data?.evolution?.[1] === 'object' &&
          Object.keys(data?.evolution?.[1])?.length === 0) ||
        (data?.evolution?.length >= 0 && data?.evolution?.length < 2)
          ? 'border-transparent min-h-[80vh] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 mx-2'
          : 'border-transparent min-h-[120vh] min-w-[104px] border-[#B0B0B0] bg-white shadow-custom rounded-lg px-1 mx-2'
      "
    >
      <div
        @click="playAudio"
        :class="
          isClicked
            ? 'container mx-auto flex justify-center items-center h-[50px] animate-bounce'
            : 'container mx-auto flex justify-center items-center h-[50px]'
        "
      >
        <div class="text-center">
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
                  type: 'spring',
                  stiffness: '200',
                  delay: 300,
                },
                y: 0,
              }"
              :src="
                data?.sprites?.other?.['official-artwork']?.front_default ||
                'fallback-image-url'
              "
              width="270"
              alt="pokemon-img"
            />
          </div>
        </div>
        <audio
          ref="audioPlayer"
          :src="`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data?.id}.ogg`"
          type="audio/ogg"
        ></audio>
      </div>

      <div class="mt-[100px] capitalize text-white mx-auto">
        <div class="flex flex-row justify-center gap-2">
          <div class="place-items-center" v-for="value in data?.types">
            <div
              :class="[
                'border rounded-lg font-medium capitalize text-center p-1 min-w-[50px]',
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

      <div class="horizontal-line my-5 mx-3"></div>

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

        <div class="flex flex-row justify-between">
          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs mx-3"
          >
            <div
              :class="['capitalize', 'color-' + data?.types?.[0]?.type?.name]"
              v-for="value in data?.stats"
            >
              <div class="font-bold mr-3">
                {{ value?.stat?.name }}
              </div>
            </div>
          </div>

          <div>
            <hr class="border-l-2 border-solid border-gray-300 h-full" />
          </div>

          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs ml-2"
          >
            <div v-for="value in data?.stats">
              <div class="base-stat font-bold">
                {{
                  value?.base_stat > 9 && value?.base_stat < 100
                    ? `0${value?.base_stat}`
                    : `${value?.base_stat}`
                }}
              </div>
            </div>
          </div>

          <div
            class="flex justify-between font-bold flex-col leading-5 text-xs my-2 mx-3"
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

        <div
          v-if="
            typeof data?.evolution?.[1] === 'object' &&
            Object.keys(data?.evolution?.[1])?.length > 0
          "
        >
          <div class="horizontal-line my-5 mx-3"></div>

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
              Evolution
            </h3>
          </div>

          <div
            :class="
              data?.evolution?.length === 2
                ? 'flex justify-center items-center my-12 mx-10'
                : 'flex justify-between items-center my-12 mx-5'
            "
          >
            <div class="mx-auto" v-for="(item, idx) in data?.evolution">
              <div
                v-if="Object.keys(data?.evolution?.[idx])?.length > 0"
                class="container mx-auto flex justify-center items-center h-[50px]"
              >
                <div class="text-center">
                  <div class="text-center">
                    <img
                      :src="
                        item?.sprites?.other?.['official-artwork']
                          ?.front_default || 'fallback-image-url'
                      "
                      width="80"
                      heiht="80"
                      alt="pokemon-img"
                    />
                  </div>
                  <h3 class="text-sm text-black capitalize text-center mt-3">
                    {{ item?.name }}
                  </h3>
                </div>

                <div
                  v-if="data?.evolution?.length === 2 ? idx < 1 : idx < 2"
                  :class="
                    data?.evolution?.length === 2
                      ? 'w-[30px] mx-20'
                      : 'w-[30px] mx-3'
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                      font-weight="semibold"
                      fill="#e0e0e0"
                      d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </div>
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

.fighting {
  background-color: #c22e28 !important;
}

.normal {
  background-color: #a8a878 !important;
}

.ground {
  background-color: #e2bf65 !important;
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

.ghost {
  background-color: #735797 !important;
}

.rock {
  background-color: #b6a136 !important;
}

.steel {
  background-color: #b7b7ce !important;
}

.dark {
  background-color: #705746 !important;
}

.fairy {
  background-color: #d685ad !important;
}

.color-dark {
  color: #705746 !important;
}

.color-fairy {
  color: #d685ad !important;
}

.color-steel {
  color: #b7b7ce !important;
}

.color-rock {
  color: #b6a136 !important;
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

.color-fighting {
  color: #c22e28 !important;
}

.color-poison {
  color: #a040a0 !important;
}

.color-ground {
  color: #e2bf65 !important;
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

.color-ghost {
  color: #735797 !important;
}

.horizontal-line {
  border-bottom: 2px solid #e0e0e0;
}

.base-stat {
  padding: 0px !important;
  margin: 0px !important;
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
  min-width: 200px; /* Default width */
  height: 7px;
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

@media (max-width: 350px) {
  .progress-container {
    min-width: 100px; /* Adjust for smaller screens */
  }
}

@media (min-width: 380px) {
  .progress-container {
    min-width: 200px; /* Adjust for larger screens */
  }
}

/* Progress Bar Animation */
@keyframes progressAnimation {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}
</style>
