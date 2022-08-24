<template>
  <input :id="currentId" :type="data.type" v-model="value" />
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const defaultValues = new Map<string, unknown>();
defaultValues.set("checkbox", false);
defaultValues.set("number", 0);
defaultValues.set("text", "");

const value = $ref(defaultValues.get(props.data.type) ?? "");
useWidgetsStore().addWidgetValue(props.data, $$(value));
</script>
