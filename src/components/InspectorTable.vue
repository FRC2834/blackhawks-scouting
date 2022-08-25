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
let selections = $ref(new Set<number>()); // If a record's index is included here, it is selected in the table

let lastClicked = 0;
let shiftPressed = false;

// Update v-model when the selections change, and change the state of the top checkbox
watchEffect(() => {
  emit("update:modelValue", selections);

  // If the number of selections equals the number of records, then every record is selected and the top checkbox should
  // automatically be checked
  topCheckbox = (selections.size > 0) && (selections.size === props.data.values.length);
});

// Updates the selections to select all/none of the records based on the state of the top checkbox.
const updateSelections = () => selections = new Set(topCheckbox ? range(props.data.values.length) : []);

// Tracks shift key presses to prevent shift-click from selecting text.
function trackShiftPressed({ shiftKey }: KeyboardEvent) {
  shiftPressed = shiftKey;
  document.onselectstart = () => !shiftKey;
}

// Track global keypress events to handle the shift key
addEventListener("keydown", trackShiftPressed);
addEventListener("keyup", trackShiftPressed);

function checkboxClicked(index: number) {
  // Handle shift-clicks to select a range of records
  // This loop uses Math.sign() and the != operator to set its direction and iterate between the current and last
  // clicked indices, regardless of their order.
  if (shiftPressed)
    for (let i = lastClicked; i != index; i += Math.sign(index - lastClicked))
      selections.add(i);

  // Update the last clicked index
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
