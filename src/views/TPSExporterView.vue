<template>
  <div id="tps-container">
    <TPSExporter />
  </div>
</template>

<script setup lang="ts">
import TPSExporter from "@/components/TPSExporter.vue";
</script>

<style>
#tps-container {
  margin: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}
</style>
