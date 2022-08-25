<template>
  <FormTeamSelectionPage ref="pageList" :ref_for="true" v-if="!config.data.skipTeamSelection" />
  <FormPage ref="pageList" v-for="[i, page] of config.data.pages.entries()" :key="i" :title="page.name">
    <FormWidget v-for="[j, widget] of page.widgets.entries()" :key="j" :id="`${i}-${j}`" :data="widget" />
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
import { useConfigStore, useWidgetsStore } from "@/common/stores";

const config = useConfigStore();
const widgets = useWidgetsStore();
const pageList = $ref([]);

// Fetch the configuration file
const fetchResult = await fetch(`${import.meta.env.BASE_URL}assets/config-${config.name}.json`);

if (!fetchResult.ok)
  throw new Error(`JSON configuration fetch failed: HTTP ${fetchResult.status} (${fetchResult.statusText})`);

config.data = await fetchResult.json();

// Reset widget values array
widgets.values = [];
</script>
