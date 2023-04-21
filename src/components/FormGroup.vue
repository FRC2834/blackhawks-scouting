<template>
  <div v-if="hasLabel" :style="{ gridArea: getGridArea(0) }" class="label" v-show="show">
    <span v-if="labelType === LabelType.PlainText">{{ name }}</span>
    <label v-else :for="id">{{ name }}</label>
  </div>
  <div :style="{ gridArea: getGridArea(hasLabel ? 1 : 0), justifySelf: align }" class="widget" v-show="show">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { LabelType } from "@/common/shared";
import { useWidgetsStore } from "@/common/stores";

type PosName = "row" | "col";

const props = withDefaults(defineProps<{
  labelType: LabelType,
  name?: string,
  id?: string,
  align?: string,
  row?: number,
  col?: number,
  rowspan?: number,
  colspan?: number,
  labelColspan?: number,
  show?: boolean
}>(), {
  rowspan: 1,
  colspan: 1,
  labelColspan: 1,
  show: true
});

const hasLabel = $computed(() => props.labelType != LabelType.None);

const widgets = useWidgetsStore();
const rowData = calcGridPos("row");
const colData = calcGridPos("col");

const getGridArea = (n: number) => `${rowData[n][0]} / ${colData[n][0]} / ${rowData[n][1]} / ${colData[n][1]}`;

widgets.lastWidgetRowEnd = rowData.at(-1)?.at(-1) ?? 1;

function calcGridPos(name: PosName): number[][] {
  const isRow = name === "row";

  // Get how many rows/columns the second cell spans, set with "rowspan" and "colspan".
  // If this isn't specified it defaults to 1.
  const span = props[`${name}span`] || 1;

  // Get the start position of the first cell (the "row"/"col" attributes)
  // If this isn't specified, it is placed a row below the previous and in column 1.
  // If there is no previous row to place under, the new cell will be on the first row.
  const cell1Start = props[name] || (isRow ? widgets.lastWidgetRowEnd || 1 : 1);

  // Get the end position of the first cell
  // If the first cell is a label, its row span will match its widget.
  const cell1End = cell1Start + ((isRow || !hasLabel) ? span : props.labelColspan);

  const ret: number[][] = [[cell1Start, cell1End]];

  if (hasLabel) {
    // Get the start and end positions of the second cell (widget)
    // It will be on the same row as its label, but a column after (widget starts when label ends).
    const cell2Start = isRow ? cell1Start : cell1End;
    const cell2End = cell2Start + span;
    ret.push([cell2Start, cell2End]);
  }

  return ret;
}
</script>

<style>
.label {
  justify-self: right;
  user-select: none;
}

.widget {
  white-space: nowrap;
}

@media (pointer:none),
(pointer:coarse) {

  /* Label tags are set to increase font size, these are not: */
  .label>span {
    font-size: 120%;
  }
}
</style>
