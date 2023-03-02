<template>
  <table>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" v-for="i of props.data.width" :key="i">{{ i }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="[i, row] of cells.entries()" :key="i">
        <th scope="row">{{ i + 1 }}</th>
        <td v-for="[j, col] of row.entries()" :key="j" @click="onCellClicked(i, j)" class="toggle-cell"
          :style="{ backgroundColor: data.colors![col] }">{{ col }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { WidgetData } from "@/common/types";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

// Color index of each cell
const cells = $ref(new Array(props.data.height ?? 1).fill(0).map(() => new Array(props.data.width ?? 1).fill(0)));

const value = $computed(() => cells.flat());
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });

function onCellClicked(row: number, col: number) {
  if (props.data.colors === undefined) return;

  // Increase the color index of the cell
  cells[row][col] = (cells[row][col] + 1) % props.data.colors.length;
}
</script>

<style>
.toggle-cell {
  width: 40px;
  height: 40px;
  cursor: pointer;
  text-align: center;
  user-select: none;
}
</style>
