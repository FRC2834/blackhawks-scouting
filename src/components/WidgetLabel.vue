<template>
  <canvas 
    ref="canvas" 
    @mousedown="startDrawing" 
    @mouseup="stopDrawing" 
    @mouseleave="stopDrawing" 
    @mousemove="draw"
    @touchstart="startDrawingTouch"
    @touchmove="drawTouch"
    @touchend="stopDrawing"
    @touchcancel="stopDrawing"
  >No canvas support</canvas>
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

// Touch event handlers
function getTouchPos(event: TouchEvent) {
  if (!canvas.value) return null;
  const rect = canvas.value.getBoundingClientRect();
  const touch = event.touches[0]; // Get first touch point
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

function startDrawingTouch(event: TouchEvent) {
  if (!ctx.value || !canvas.value) return;
  const pos = getTouchPos(event);
  if (!pos) return;

  isDrawing.value = true;
  ctx.value.beginPath();
  ctx.value.moveTo(pos.x, pos.y);
  event.preventDefault(); // Prevent scrolling while drawing
}

function drawTouch(event: TouchEvent) {
  if (!isDrawing.value || !ctx.value) return;
  const pos = getTouchPos(event);
  if (!pos) return;

  ctx.value.lineTo(pos.x, pos.y);
  ctx.value.stroke();
  event.preventDefault(); // Prevent scrolling while drawing
}
</script>

<style>
canvas {
  border: 1px solid #ccc;
  touch-action: none; /* Prevent scrolling when drawing on touch screens */
}
</style>
