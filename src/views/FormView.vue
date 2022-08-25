<template>
  <div id="form-container">
    <Suspense v-if="name">
      <template #default>
        <FormContainer />
      </template>
      <template #fallback>Loading form...</template>
    </Suspense>
    <p v-else>No Configuration Specified</p>
  </div>
</template>

<script setup lang="ts">
import FormContainer from "@/components/FormContainer.vue";
import { useConfigStore } from "@/common/stores";
import { useRoute } from "vue-router";

// Set configuration name based on the URL params
const config = useConfigStore();
const name = useRoute().query.name?.toString();
config.name = name ?? "";
</script>

<style>
#form-container {
  display: grid;
  height: 100vh;
  gap: 40px;
  grid-template-rows: 1fr auto;
  justify-items: center;
}
</style>
