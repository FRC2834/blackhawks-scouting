<template>
  <input :id="currentId" :type="data.type" v-model="value" />
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetCheckbox, WidgetNumber, WidgetText } from "@/config";

const props = defineProps<{
  data: Widget & (WidgetCheckbox | WidgetNumber | WidgetText),
  currentId: string
}>();

// Table of default values for different input types
const defaultValues = new Map<string, unknown>([
  ["checkbox", false],
  ["number", 0],
  ["text", ""]
]);

const value = $ref(defaultValues.get(props.data.type));
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
