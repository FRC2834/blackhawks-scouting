<template>
  <textarea rows="5" cols="40" v-model="value" :id="currentId"></textarea>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const value = $ref("");
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
