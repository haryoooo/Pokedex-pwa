import { ref, onMounted, onUnmounted } from "vue";

export const useOutsideClick = (action, show) => {
  const element = ref(null);

  const handleClickOutside = (event) => {
    if (element.value && !element.value.contains(event.target) && show.value) {
      action();
    }
  };

  onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  return element;
};
