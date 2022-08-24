<template>{{ data.name }}</template>

<script setup lang="ts">
import { WidgetData } from "@/common/types";

defineProps<{
  data: WidgetData,
  currentId: string
}>();
</script>
