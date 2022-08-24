<template>
  <table class="inspector-table">
    <thead>
      <tr>
        <th><input type="checkbox" v-model="topCheckbox" @change="updateSelections" /></th>
        <th v-for="[i, value] of data.header.entries()" :key="i">{{ value }}</th>
      </tr>
    </thead>
    <tbody>
      <label v-for="[i, record] of data.values.entries()" :key="i" :class="{ select: selections.has(i) }">
        <td><input type="checkbox" v-model="selections" :value="i" @change="checkboxClicked(i)" /></td>
        <td v-for="[j, value] of record.entries()" :key="j">{{ value }}</td>
      </label>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { range } from "lodash";
import { SavedData } from "@/common/stores";
import { watchEffect } from "vue";

const props = defineProps<{
  modelValue: Set<number>,
  data: SavedData
}>();

const emit = defineEmits(["update:modelValue"]);

let topCheckbox = $ref(false);
let selections = $ref(new Set<number>());

let lastClicked = 0;
let shiftPressed = false;

watchEffect(() => {
  emit("update:modelValue", selections);
  topCheckbox = (selections.size > 0) && (selections.size === props.data.values.length);
});

const updateSelections = () => selections = new Set(topCheckbox ? range(props.data.values.length) : []);

function trackShiftPressed({ shiftKey }: KeyboardEvent) {
  shiftPressed = shiftKey;
  document.onselectstart = () => !shiftKey;
}

addEventListener("keydown", trackShiftPressed);
addEventListener("keyup", trackShiftPressed);

function checkboxClicked(index: number) {
  // Handle shift-clicks
  if (shiftPressed)
    for (let i = lastClicked; i != index; i += Math.sign(index - lastClicked))
      selections.add(i);

  lastClicked = index;
}
</script>

<style lang="postcss">
.inspector-table {
  white-space: pre;

  label {
    display: table-row;
    cursor: pointer;
    transition: background-color 0.1s;
  }

  .select {
    background-color: #464646;
  }
}
</style>
