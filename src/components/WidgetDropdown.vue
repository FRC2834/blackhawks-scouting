<template>
  <select :id="currentId" v-model="value">
    <option v-for="[i, value] of data.options?.entries()" :value="i" :key="i">{{ value }}</option>
  </select>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const value = $ref(0);
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
