<template>
  <button id="opener" v-if="errors.length > 0" @click="errorList?.showModal">{{ errors.length }} {{ label }}</button>
  <dialog ref="errorList" id="dialog">
    <div id="dialog-header">
      <h4 id="dialog-title">Error List</h4>
      <button id="dialog-close" @click="errorList?.close">
        <img src="@/assets/close.svg" alt="Close" />
      </button>
    </div>
    <div id="dialog-error-container">
      <div v-for="[i, error] of errors.entries()" :key="i" class="error-entry">{{ error }}</div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  errors: string[]
}>();

const errorList = $ref<HTMLDialogElement>();
const label = $computed(() => (props.errors.length === 1) ? "Error" : "Errors");
</script>

<style lang="postcss">
#opener {
  background-color: #dd1e1e;
  position: fixed;
  top: 0;
  left: 0;
}

#dialog {
  padding: 0;
  background-color: #333;
  min-width: 20vw;
  max-width: 60vw;
  border: 2px solid var(--text-color);

  &::backdrop {
    background-color: #0000006c;
  }
}

#dialog-header {
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--text-color);
}

#dialog-title {
  margin: 0;
}

#dialog-close {
  background-color: inherit;
  padding: 0;
  margin-right: 4px;

  img {
    width: 0.9em;
    height: 0.9em;
  }
}

#dialog-error-container {
  overflow: auto;
  padding: 4px;
  max-height: 60vh;
}

.error-entry {
  margin: 4px 0;
  font-family: monospace;
  white-space: pre;

  &::before {
    vertical-align: middle;
    content: url("@/assets/error.svg");
    display: inline-block;
    height: 1.1em;
    width: 1.1em;
    margin-right: 6px;
  }
}
</style>
