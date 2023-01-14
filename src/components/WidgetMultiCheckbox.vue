<template>
  <label v-for="[i, name] of data.options?.entries()" :key="i">
    <input type="checkbox" v-model="value" :value="i" />{{ name }}<br />
  </label>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const value = $ref([]);
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
