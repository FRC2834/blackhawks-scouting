<template>
  <h4>{{ data.name }}</h4>
</template>

<script setup lang="ts">
import { Widget, WidgetHeading } from "@/config";

defineProps<{
  data: Widget & WidgetHeading,
  currentId: string
}>();
</script>
