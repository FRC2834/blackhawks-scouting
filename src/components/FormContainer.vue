<template>
  <FormTeamSelectionPage ref="pageList" :ref_for="true" v-if="!config.data.skipTeamSelection" />
  <FormPage ref="pageList" v-for="[i, page] of config.data.pages.entries()" :key="i" :title="page.name">
    <FormWidget v-for="[j, widget] of page.widgets.entries()" :key="j" :id="`${i}-${j}`" :data="widget" ref="widgetList" />
  </FormPage>
  <FormDownloadPage ref="pageList" :ref_for="true" />
  <FormNavMenu :pages="pageList" />
</template>

<script setup lang="ts">
import FormDownloadPage from "./FormDownloadPage.vue";
import FormNavMenu from "./FormNavMenu.vue";
import FormPage from "./FormPage.vue";
import FormTeamSelectionPage from "./FormTeamSelectionPage.vue";
import FormWidget from "./FormWidget.vue";
import { useConfigStore, useWidgetsStore, useValidationStore } from "@/common/stores";
import { watchEffect } from "vue";

const config = useConfigStore();
const widgets = useWidgetsStore();
const validation = useValidationStore();

const pageList = $ref(new Array<InstanceType<typeof FormPage>>());
const widgetList = $ref(new Array<InstanceType<typeof FormWidget>>());

// Fetch the configuration file
const fetchResult = await fetch(`${import.meta.env.BASE_URL}assets/config-${config.name}.json`);

if (!fetchResult.ok)
  throw new Error(`JSON configuration fetch failed: HTTP ${fetchResult.status} (${fetchResult.statusText})`);

config.data = await fetchResult.json();

// Reset widget values array
widgets.values = [];

watchEffect(() => {
  if (!validation.trigger) return;

  // Get all the widgets on the currently-shown page, then validate each one
  const pageIdx = pageList.findIndex(i => i.shown) - (config.data.skipTeamSelection ? 0 : 1);
  if (pageIdx >= 0) validation.success = widgetList.filter(i => i.id.startsWith(pageIdx.toString())).every(i => i.validate());
  else validation.success = true;

  // Unset the trigger flag (also indicates validation is complete)
  validation.trigger = false;
});
</script>
