<template>
  <nav>
    <div id="button-container">
      <button @click="shown--" :disabled="shown === 0">&#10096; Prev</button>
      <button @click="validation.trigger = true" :disabled="shown === pages.length - 1">Next &#10095;</button>
    </div>
    <div v-for="[i, page] of pages.entries()" :key="i" :class="{ link: true, active: i === shown }" @click="shown = i">
      {{ unref(page).title }}
    </div>
  </nav>
</template>

<script setup lang="ts">
import FormPage from "./FormPage.vue";
import { unref, watchEffect } from "vue";
import { useValidationStore } from "@/common/stores";

const props = defineProps<{
  pages: InstanceType<typeof FormPage>[]
}>();

const validation = useValidationStore();

let shown = $ref(0);

// If the index of the shown page changes, iterate through each page object and update their states
watchEffect(() => {
  for (const [i, page] of props.pages.entries()) unref(page).setShown(i === shown);
});

// If validation is successful, go to the next page
watchEffect(() => {
  if (!validation.trigger && validation.success) {
    shown++;
    validation.success = false;
  }
});
</script>

<style>
nav {
  width: min(400px, 100%);
  background-color: #222;
}

button:disabled {
  opacity: 0.5;
  cursor: unset;
}

#button-container {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.active {
  background-color: #424242;
}

.link {
  user-select: none;
  text-align: center;
  padding: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.link:not(.active):hover {
  background-color: #3d3d3d;
}
</style>
