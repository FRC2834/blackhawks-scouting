<template>
  <table>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col" v-for="i of data.width" :key="i" :style="{ backgroundColor: data.colColors?.[i - 1] }">{{ i }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="[i, row] of cells.entries()" :key="i">
        <th scope="row" :style="{ backgroundColor: data.rowColors?.[i] }">{{ i + 1 }}</th>
        <td v-for="[j, col] of row.entries()" :key="j" @click="onCellClicked(i, j)" class="toggle-cell"
          :style="{ backgroundColor: data.colors[col] }">{{ col }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetToggleGrid } from "@/config";

const props = defineProps<{
  data: Widget & WidgetToggleGrid,
  currentId: string
}>();

// Color index of each cell
const cells = $ref(new Array(props.data.height).fill(0).map(() => new Array(props.data.width).fill(0)));

const value = $computed(() => cells.flat());
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });

function onCellClicked(row: number, col: number) {
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
