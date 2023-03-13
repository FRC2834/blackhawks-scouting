<template>
  <div :style="{ width: unitsString(data.width), height: unitsString(data.height) }"></div>
</template>

<script setup lang="ts">
import { Widget, WidgetSpacer } from "@/config";

defineProps<{
  data: Widget & WidgetSpacer,
  currentId: string
}>();

const unitsString = (n: number | undefined) => n?.toString().concat("px");
</script>
