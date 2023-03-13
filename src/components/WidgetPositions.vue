<template>
  <canvas ref="canvas" @click="click">No canvas support</canvas>
  <button style="margin-left: 6px;" @click="selections.pop">Undo Last</button>
</template>

<script setup lang="ts">
import { get } from "lodash";
import { useWidgetsStore } from "@/common/stores";
import { watch } from "vue";
import { Widget, WidgetPositions } from "@/config";

interface Point {
  readonly x: number;
  readonly y: number;
}

type DimensionName = "width" | "height";

const props = defineProps<{
  data: Widget & WidgetPositions,
  currentId: string
}>();

const selections = $ref(new Array<Point>());
const canvas = $ref<HTMLCanvasElement>();

// Scales a coordinate on the canvas between 0 and 1 using the image dimensions.
const divide = (val: number, dimension: DimensionName) => (val / (get(canvas, dimension) ?? 1)).toFixed(3);

// The exported value
const value = $computed(() => selections.map(c => `${divide(c.x, "width")},${divide(c.y, "height")}`));
defineExpose({ index: useWidgetsStore().addWidgetValue(props.data, $$(value)) });

// Load the image file
const image = new Image();
image.src = `${import.meta.env.BASE_URL}assets/${props.data.file}`;
image.addEventListener("load", () => {
  setDimensions("width", "height");
  setDimensions("height", "width");
  draw();
});

// Redraw the canvas when the selections change
watch(selections, draw);

// Redraws the canvas.
function draw() {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear the canvas, then draw the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Draw a circle around each selected point
  ctx.lineWidth = 1;
  ctx.strokeStyle = props.data.selectColor ?? "#ddd";
  for (const { x, y } of selections) {
    ctx.beginPath();
    ctx.arc(x, y, props.data.selectRadius || 5, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

// Sets the dimensions of the canvas based on the image dimensions and configuration data.
function setDimensions(a: DimensionName, b: DimensionName) {
  if (!canvas) return;

  const dims = { width: props.data.width ?? 0, height: props.data.height ?? 0 };

  if (dims[a] > 0) canvas[a] = dims[a];
  else if (dims[b] > 0) canvas[a] = (image[a] * dims[b]) / image[b];
  else canvas[a] = image[a];
}

// Adds a new selection to the array.
function click(event: MouseEvent) {
  const point = { x: event.offsetX, y: event.offsetY };

  if (!props.data.allowMultiple) selections.pop(); // Only allow one value in the array if specified
  selections.push(point);
}
</script>
