<template>
  <img :src="absolutePath" :alt="`Could not load file assets/${data.file}`" :width="data.width" :height="data.height" />
</template>

<script setup lang="ts">
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

// Get the full path to the file
const absolutePath = $computed(() => `${import.meta.env.BASE_URL}assets/${props.data.file}`);
</script>
