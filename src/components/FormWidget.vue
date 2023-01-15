<template>
  <FormGroup v-if="info" :id="id" :label-type="data.noLabel ? LabelType.None : info.label" v-bind="mappedProps">
    <div :style="{ width: 'max-content', border: border }">
      <component :is="info.class" :data="data" :current-id="id" ref="desc" />
    </div>
  </FormGroup>
</template>

<script setup lang="ts">
import FormGroup from "@/components/FormGroup.vue";
import { has, pick } from "lodash";
import { LabelType, WidgetData } from "@/common/types";
import { useWidgetsStore } from "@/common/stores";
import WidgetDropdown from "@/components/WidgetDropdown.vue";
import WidgetHeading from "@/components/WidgetHeading.vue";
import WidgetInput from "@/components/WidgetInput.vue";
import WidgetLabel from "@/components/WidgetLabel.vue";
import WidgetMultiCheckbox from "@/components/WidgetMultiCheckbox.vue";
import WidgetPicture from "@/components/WidgetPicture.vue";
import WidgetPositions from "@/components/WidgetPositions.vue";
import WidgetRadio from "@/components/WidgetRadio.vue";
import WidgetSpacer from "@/components/WidgetSpacer.vue";
import WidgetSpinbox from "@/components/WidgetSpinbox.vue";
import WidgetStopwatch from "@/components/WidgetStopwatch.vue";
import WidgetTextarea from "@/components/WidgetTextarea.vue";

const props = defineProps<{
  id: string,
  data: WidgetData
}>();

defineExpose({ id: props.id, type: props.data.type, validate });

interface WidgetDesc {
  index?: number
}

const widgets = useWidgetsStore();

const desc = $ref<WidgetDesc>();

const widgetName = $computed(() => `<${props.data.name ?? "Unnamed widget"}>`);
const widgetType = $computed(() => `"${props.data.type ?? "[None]"}"`);

let border = $ref("none");

// Table containing metadata for each widget type
const info = {
  dropdown:      { class: WidgetDropdown,      label: LabelType.LabelTag,  required: ["name", "options"] },
  heading:       { class: WidgetHeading,       label: LabelType.None,      required: ["name"] },
  label:         { class: WidgetLabel,         label: LabelType.None,      required: ["name"] },
  text:          { class: WidgetInput,         label: LabelType.LabelTag,  required: ["name"] },
  number:        { class: WidgetInput,         label: LabelType.LabelTag,  required: ["name"] },
  checkbox:      { class: WidgetInput,         label: LabelType.LabelTag,  required: ["name"] },
  multicheckbox: { class: WidgetMultiCheckbox, label: LabelType.PlainText, required: ["name", "options"] },
  picture:       { class: WidgetPicture,       label: LabelType.None,      required: ["file"] },
  positions:     { class: WidgetPositions,     label: LabelType.PlainText, required: ["name", "file"] },
  radio:         { class: WidgetRadio,         label: LabelType.PlainText, required: ["name", "options"] },
  spacer:        { class: WidgetSpacer,        label: LabelType.None,      required: [] },
  spinbox:       { class: WidgetSpinbox,       label: LabelType.LabelTag,  required: ["name"] },
  stopwatch:     { class: WidgetStopwatch,     label: LabelType.PlainText, required: ["name"] },
  textarea:      { class: WidgetTextarea,      label: LabelType.LabelTag,  required: ["name"] }
}[props.data.type];

if (info === undefined)
  throw new Error(`Unknown type ${widgetType} in widget ${widgetName}`);

for (const i of info.required)
  if (!has(props.data, i))
    throw new Error(`Required attribute "${i}" was not specified in widget ${widgetName} (type ${widgetType})`);

// Props to pass from the widget data to the sub-components
const mappedProps = pick(props.data, ["name", "align", "row", "col", "rowspan", "colspan", "labelColspan"]);

// Validates the value of the widget.
function validate() {
  // Some widgets don't export values (and thus don't have entries in the array)
  if (desc?.index === undefined) return true;

  // Only some widget types can be validated
  const canValidate = ["dropdown", "text", "number", "multicheckbox", "positions", "stopwatch", "textarea"];
  if (!canValidate.includes(props.data.type)) return true;

  // Skip validation if not specified
  const { validation } = props.data;
  if (validation === undefined) return true;

  // Get associated widget value from array
  const widgetVal = widgets.values[desc.index].value;

  // Map widget value to a number to validate
  let valueToValidate = 0;
  if ((typeof widgetVal === "string") || Array.isArray(widgetVal)) valueToValidate = widgetVal.length;
  else if (typeof widgetVal === "number") valueToValidate = widgetVal;
  else return false; // Value can't be validated (internal app error)

  // Functions to validate with a single value
  const validationFuncs = new Map<string, (n: number, val: number) => boolean>([
    ["less", (n: number, val: number) => n < val],
    ["lessOrEqual", (n: number, val: number) => n <= val],
    ["greater", (n: number, val: number) => n > val],
    ["greaterOrEqual", (n: number, val: number) => n >= val],
    ["equal", (n: number, val: number) => n === val]
  ]);

  // Functions to validate with a range
  const rangeValidationFuncs = new Map<string, (n: number, vals: number[]) => boolean>([
    ["inRange", (n: number, val: number[]) => n >= Math.min(...val) && n <= Math.max(...val)],
    ["outOfRange", (n: number, val: number[]) => n < Math.min(...val) || n > Math.max(...val)]
  ]);

  const { comparison, value } = validation;

  // Validate the widget value
  // Some code is duplicated in the conditional branches to avoid false linter errors.
  let validationResult = true;
  if (validationFuncs.has(comparison) && typeof value === "number") {
    const f = validationFuncs.get(comparison);
    if (f === undefined) return true;

    validationResult = f(valueToValidate, value);
  } else if (rangeValidationFuncs.has(comparison) && Array.isArray(value)) {
    const f = rangeValidationFuncs.get(comparison);
    if (f === undefined) return true;

    validationResult = f(valueToValidate, value);
  } else {
    // Invalid validation criteria
    return true;
  }

  // Set border and return result
  border = validationResult ? "none" : "2px solid red";
  return validationResult;
}
</script>
