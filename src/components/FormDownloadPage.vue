<template>
  <FormPage title="Download Data" ref="page">
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <button @click="clearForm">Save and Clear Form</button>
    </FormGroup>
    <FormGroup :label-type="LabelType.None">
      <div style="height: 20px;"></div>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <span v-if="widgets.downloadLink === null">No Saved Data</span>
      <a v-else :download="`scouted-${config.name}.csv`" :href="widgets.downloadLink">Download Saved CSV</a>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <RouterLink :to="{ name: 'inspector' }">Data Inspector</RouterLink>
    </FormGroup>
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <RouterLink :to="{ name: 'home' }">Home</RouterLink>
    </FormGroup>
  </FormPage>
</template>

<script setup lang="ts">
import FormPage from "./FormPage.vue";
import FormGroup from "./FormGroup.vue";
import { LabelType } from "@/common/shared";
import { computed } from "vue";
import { useConfigStore, useWidgetsStore } from "@/common/stores";
import { useRouter } from "vue-router";

const config = useConfigStore();
const widgets = useWidgetsStore();

const router = useRouter();

const page = $ref<InstanceType<typeof FormPage>>();
defineExpose({ title: computed(() => page?.title), setShown: computed(() => page?.setShown) });

function clearForm() {
  widgets.save();
  router.go(0); // Reload the page
}
</script>
