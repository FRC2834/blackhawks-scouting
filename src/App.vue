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
  --text-color: #3cff06;
  --bg-color: #000000;
  --button-color: #000000;
  --input-color: #000000;
}

* {
  color: var(--text-color);
  box-sizing: border-box;
}

img {
  display: block;
  user-select: none;
}

body {
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  background-color: var(--bg-color);
  margin: 0;
  font-stretch: ultra-expanded;
}

button {
  background-color: var(--button-color);
  user-select: none;
  cursor: pointer;
}

input, select, textarea {
  background-color: var(--input-color);
}

button, input, select, textarea {
  font-size: 100%;
  border: none;
}

table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid var(--text-color);
  padding: 2px;
}

@media (pointer:none),
(pointer:coarse) {

  button,
  input,
  select,
  label {
    font-size: 120%;
  }
}
</style>
