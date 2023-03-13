<template>
  <textarea rows="5" cols="40" v-model="value" :id="currentId"></textarea>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetTextarea } from "@/config";

const props = defineProps<{
  data: Widget & WidgetTextarea,
  currentId: string
}>();

const value = $ref("");
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });
</script>
