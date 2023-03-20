<template>
  <ErrorList :errors="errors" />
  <RouterView />
</template>

<script setup lang="ts">
import ErrorList from "@/components/ErrorList.vue";
import { onErrorCaptured } from "vue";

const errors = $ref(new Array<string>());

// Set handler to capture errors and push them to an array
onErrorCaptured(obj => {
  const errorToString = (e: Error) => `${e.name}: ${e.message}`;

  if (Array.isArray(obj)) errors.push(...obj.map(errorToString));
  else errors.push(errorToString(obj));

  return false;
});
</script>

<style>
:root {
  --text-color: #F9F6EE;
  --bg-color: #1B1212;
  --button-color: #C70039;
  --input-color: #36454F;
}

* {
  color: var(--text-color);
  box-sizing: border-box;
}

img {
  display: block;
  user-select: none;
  border-radius: 5px;
}

body {
  font-family: Cantarell, Arial, Helvetica, sans-serif;
  background-color: var(--bg-color);
  margin: 0;
}

button {
  background-color: var(--button-color);
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
}

input, select, textarea {
  background-color: var(--input-color);
  border-radius: 5px;
}

button, input, select, textarea {
  font-size: 100%;
  border: none;
  border-radius: 5px;
}

table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid var(--text-color);
  border-radius: 5px;
  padding: 2px;
}
</style>
