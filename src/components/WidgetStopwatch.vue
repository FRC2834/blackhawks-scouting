<template>
  <div class="stopwatch-controls-container">
    <span>{{ trunc(time) }}</span>
    <button @click="start">{{ data.startLabel ?? "Start" }}</button>
    <button @click="lap">{{ data.lapLabel ?? "Lap" }}</button>
    <button @click="stop">{{ data.stopLabel ?? "Stop" }}</button>
    <button @click="clear">Clear</button>
  </div>
  <div class="lap-table-container" v-show="laps.length > 0">
    <table>
      <caption>Laps</caption>
      <thead>
        <tr>
          <th>#</th>
          <th>Time</th>
          <th>Elapsed</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[i, { timestamp, elapsed }] of laps.entries()" :key="i">
          <td>{{ laps.length - i }}</td>
          <td>{{ trunc(timestamp) }}</td>
          <td>{{ trunc(elapsed) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { Widget, WidgetStopwatch } from "@/config";

const props = defineProps<{
  data: Widget & WidgetStopwatch,
  currentId: string
}>();

interface Lap {
  readonly timestamp: number;
  readonly elapsed: number;
}

let time = $ref(0);
let updateHandle: number | null = null; // The variable used to stop the timer counting
const laps = $ref(new Array<Lap>());

// The exported value - reverse laps, then add the total elapsed time
const value = $computed(() => laps.map(i => trunc(i.elapsed)).reverse().concat(trunc(time)));
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });

// Truncates a floating-point number for display.
const trunc = (n: number) => n.toFixed(1);

function start() {
  // Start timer counting (explicit `window` reference used to avoid conflicts with Node.js functions)
  if (updateHandle === null) updateHandle = window.setInterval(() => time += 0.1, 100);
}

function stop() {
  // Stop timer counting
  if (updateHandle !== null) window.clearInterval(updateHandle);
  updateHandle = null;
}

function lap() {
  // Check if the timer is running and the number of laps has not exceeded the maximum (if any)
  if (updateHandle === null) return;
  if (laps.length === (props.data.maxLaps ?? Number.MAX_SAFE_INTEGER)) return;

  // Get lap information, add to front of array so newest laps appear first in the list
  const timestamp = time;
  const elapsed = timestamp - (laps[0]?.timestamp ?? 0);
  laps.unshift({ timestamp, elapsed });
}

function clear() {
  stop();
  time = 0;
  while (laps.length) laps.pop(); // Clear laps array
}
</script>

<style>
.stopwatch-controls-container>button {
  margin: 4px;
}

.lap-table-container {
  overflow-y: auto;
  width: max-content;
  max-height: 200px;
  padding: 2px;
}
</style>
