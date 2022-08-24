<template>
  <h4>{{ data.name }}</h4>
</template>

<script setup lang="ts">
import { WidgetData } from "@/common/types";

defineProps<{
  data: WidgetData,
  currentId: string
}>();
</script>
