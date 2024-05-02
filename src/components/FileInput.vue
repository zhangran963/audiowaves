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
    background-color: var(--primary);
    box-shadow:
      inset 0.2rem 0.2rem 1rem var(--primary-light),
      inset -0.2rem -0.2rem 1rem var(--primary-dark),
      0.3rem 0.3rem 0.6rem var(--greyLight-2),
      -0.2rem -0.2rem 0.5rem var(--white);
    color: var(--greyLight-1);
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
