<template>
  <div id="home-container">
    <Suspense>
      <template #default>
        <HomePage />
      </template>
      <template #fallback>Loading...</template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import HomePage from "@/components/HomePage.vue";
</script>

<style>
#home-container {
  display: grid;
  justify-content: center;
}
</style>
