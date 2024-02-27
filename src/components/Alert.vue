<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Alert",
  setup() {
    // Method to show the alert
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
  <div>
    <!-- Button to trigger the popup -->
    <button @click="showAlert">Show Alert</button>

    <!-- Popup alert -->
    <div v-if="isVisible" class="popup">
      <div class="popup-content">
        <!-- Close button -->
        <span class="close" @click="handleGoBack">&times;</span>
        <!-- Alert message -->
        <p>This is an alert!</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Popup styles */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f4f4f4;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.popup-content {
  position: relative;
}

.close {
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  color: #aaa;
}

.close:hover {
  color: #000;
}
</style>
