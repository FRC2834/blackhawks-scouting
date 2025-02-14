<template>
  <FormPage title="Download Data" ref="page">
    <FormGroup :label-type="LabelType.None" :colspan="2" align="center">
      <button @click="qrContainer?.showModal()">Generate QR Code</button>
    </FormGroup>
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
  <dialog ref="qrContainer">
    <div id="qr-dialog-contents">
      <button id="qr-dialog-close" @click="qrContainer?.close">Close</button>
      <div>
        <input type="checkbox" v-model="excludeHeaders" id="exclude-headers" />
        <label for="exclude-headers">Exclude headers in code</label>
      </div>
      <qrcode-vue :value="qrData" level="M" render-as="svg" :size="350" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import FormPage from "./FormPage.vue";
import FormGroup from "./FormGroup.vue";
import { LabelType } from "@/common/shared";
import { computed } from "vue";
import QrcodeVue from "qrcode.vue";
import { useConfigStore, useWidgetsStore } from "@/common/stores";
import { useRouter } from "vue-router";
import confetti from "canvas-confetti";

function launchConfetti() {
  confetti({
    particleCount: 100,
    spread: 160,
    gravity: 4,
    
  });
  confetti({
    particleCount: 100,
    spread: 80,
    gravity: 4,
    angle: 45,
  });
  confetti({
    particleCount: 100,
    spread: 80,
    gravity: 4,
    angle: 135,
  });
}

const config = useConfigStore();
const widgets = useWidgetsStore();

const router = useRouter();

const page = $ref<InstanceType<typeof FormPage>>();
const qrContainer = $ref<HTMLDialogElement>();
const qrData = $computed(() => widgets.toCSVString(widgets.getWidgetsAsCSV(), excludeHeaders));
const excludeHeaders = $ref(false);

function clearForm() {
  widgets.save();
  
  launchConfetti();
  setTimeout(() => {
    router.go(0); // Reload the page
  }, 1000);
  
}

defineExpose({ title: computed(() => page?.title), setShown: computed(() => page?.setShown) });
</script>

<style lang="postcss">
#qr-dialog-contents {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;

  button {
    align-self: flex-end;
  }

  label {
    color: black;
  }
}
</style>
