<template>
  <template v-for="[i, name] of data.options?.entries()" :key="i">
    <input type="checkbox" v-model="value" :value="i" :id="idFromIndex(i)" />
    <label :for="idFromIndex(i)">{{ name }}</label>
    <br />
  </template>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const idFromIndex = (i: number) => `${props.currentId}-${i}`;

const value = $ref([]);
useWidgetsStore().addWidgetValue(props.data, $$(value));
</script>
