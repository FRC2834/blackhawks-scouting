<template>
  <canvas ref="canvas" @click="click">No canvas support</canvas>
  <button style="margin-left: 6px;" @click="selections.pop">Undo Last</button>
</template>

<script setup lang="ts">
import { useWidgetsStore } from "@/common/stores";
import { watch } from "vue";
import { WidgetData } from "@/common/types";

interface Point {
  readonly x: number;
  readonly y: number;
}

type DimensionName = "width" | "height";

const props = defineProps<{
  data: WidgetData,
  currentId: string
}>();

const selections = $ref(new Array<Point>());
const canvas = $ref<HTMLCanvasElement>();

const divide = (val: number, dimension: DimensionName) => canvas ? (val / canvas[dimension]).toFixed(3) : 0;

const value = $computed(() => selections.map(c => `${divide(c.x, "width")},${divide(c.y, "height")}`));
useWidgetsStore().addWidgetValue(props.data, $$(value));

const image = new Image();
image.src = `${import.meta.env.BASE_URL}assets/${props.data.file}`;
image.addEventListener("load", () => {
  setDimensions("width", "height");
  setDimensions("height", "width");
  draw();
});

watch(selections, draw);

function draw() {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 1;
  ctx.strokeStyle = props.data.selectColor ?? "#ddd";
  for (const { x, y } of selections) {
    ctx.beginPath();
    ctx.arc(x, y, props.data.selectRadius || 5, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
}

function setDimensions(a: DimensionName, b: DimensionName) {
  if (!canvas) return;

  const dims = { width: props.data.width ?? 0, height: props.data.height ?? 0 };

  if (dims[a] > 0) canvas[a] = dims[a];
  else if (dims[b] > 0) canvas[a] = (image[a] * dims[b]) / image[b];
  else canvas[a] = image[a];
}

function click(event: MouseEvent) {
  const point = { x: event.offsetX, y: event.offsetY };

  if (!props.data.allowMultiple) selections.pop();
  selections.push(point);
}
</script>
