<template>{{ data.name }}</template>

<script setup lang="ts">
import { Widget, WidgetLabel } from "@/config";

defineProps<{
  data: Widget & WidgetLabel,
  currentId: string
}>();
</script>
