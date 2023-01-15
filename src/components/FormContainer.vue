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
  if (validation.triggerPage.length == 0) return;

  validation.failedPage = -1;

  for (const i of validation.triggerPage) {
    const index = i - (config.data.skipTeamSelection ? 0 : 1);
    const failed = widgetList.filter(e => e.id.startsWith(index.toString())).map(e => e.validate()).includes(false);
    if (failed) {
      validation.failedPage = i;
      break;
    }
  }

  // Unset the trigger flag (also indicates validation is complete)
  validation.triggerPage = [];
});
</script>
