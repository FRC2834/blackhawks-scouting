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

// Validate config data against JSON schema
const t = config.validateSchema();
if (t.length > 0) throw t;

// Reset widget values array
widgets.values = [];

watchEffect(() => {
  if (validation.triggerPages.length == 0) return;

  // Assume all pages pass validation
  validation.failedPage = -1;

  // Iterate through the pages that need validation
  for (const i of validation.triggerPages) {
    const index = i - (config.data.skipTeamSelection ? 0 : 1);
    const failed = widgetList.filter(e => e.id.startsWith(index.toString())).map(e => e.validate()).includes(false);
    if (failed) {
      // Keep track of the first failed page
      validation.failedPage = i;
      break;
    }
  }

  // Unset the triggered pages (also indicates validation is complete)
  validation.triggerPages = [];
});
</script>
