<template>
  <div class="file-input-wrapper">
    <input
      id="file-input"
      ref="fileInputRef"
      class="file-input"
      type="file"
      accept="audio/mp3"
      v-bind="$attrs"
    />
    <label className="file-button" for="file-input">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'

export default {
  name: 'FileInput',
  inheritAttrs: true,
  emits: ['fileInputMounted'],
  setup(_, ctx) {
    const fileInputRef = ref<HTMLInputElement>()
    watch(
      fileInputRef,
      (element) => {
        ctx.emit('fileInputMounted', element)
      },
      {
        once: true
      }
    )
    return {
      fileInputRef
    }
  }
}
</script>

<style lang="scss">
.file-input-wrapper {
  .file-input {
    display: none;
  }
  .file-button {
    display: inline-block;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    min-width: 200px;
    text-align: center;
  }
  .file-button:hover {
    background-color: #0056b3;
  }
}
</style>
