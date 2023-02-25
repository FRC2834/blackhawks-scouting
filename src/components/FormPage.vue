<template>
  <div v-show="show">
    <h1 class="page-heading">{{ config.data.heading ?? "Scouting" }}</h1>
    <h3 v-if="teamDesc?.length > 0" class="page-heading">Team: {{ teamDesc }}</h3>
    <img v-if="config.data.logo" :src="absoluteLogoPath" alt="Cannot load logo file" class="center" />
    <h2 class="page-heading">{{ title }}</h2>
    <div class="grid">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfigStore, useWidgetsStore } from "@/common/stores";

const props = defineProps<{
  title: string
}>();

const config = useConfigStore();
const widgets = useWidgetsStore();

const teamDesc = $computed(() => widgets.values.find(i => i.name == "Team")?.value.replaceAll(",", ", "));

// Get the full path to the logo image
const absoluteLogoPath = $computed(() => `${import.meta.env.BASE_URL}assets/${config.data.logo}`);

let show = $ref(false);

widgets.lastWidgetRowEnd = 1;

// Expose page data
defineExpose({ title: props.title, setShown: (value: boolean) => show = value });
</script>

<style>
.grid {
  display: grid;
  align-items: center;
  gap: 12px;
}

.center {
  margin-left: auto;
  margin-right: auto;
}

.page-heading {
  text-align: center;
}
</style>
