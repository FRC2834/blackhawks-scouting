<template>
  <canvas ref="canvas" @mousedown="startDrawing" @mouseup="stopDrawing" @mouseleave="stopDrawing" @mousemove="draw">No canvas support</canvas>
  <button style="margin-left: 6px;" @click="clearCanvas">Clear</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
const ctx = ref<CanvasRenderingContext2D | null>(null);

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext("2d");
    if (ctx.value) {
      ctx.value.lineWidth = 2;
      ctx.value.strokeStyle = "#fff";
      ctx.value.lineCap = "round";
    }
  }
});

function startDrawing(event: MouseEvent) {
  if (!ctx.value || !canvas.value) return;
  isDrawing.value = true;
  ctx.value.beginPath();
  ctx.value.moveTo(event.offsetX, event.offsetY);
}

function draw(event: MouseEvent) {
  if (!isDrawing.value || !ctx.value) return;
  ctx.value.lineTo(event.offsetX, event.offsetY);
  ctx.value.stroke();
}

function stopDrawing() {
  isDrawing.value = false;
}

function clearCanvas() {
  if (!ctx.value || !canvas.value) return;
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
}
</script>

<style>
canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
}
</style>