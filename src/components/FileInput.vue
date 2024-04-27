<template>
  <div class="file-input-wrapper">
    <input id="file-input" :ref="fileInputRef" type="file" accept="audio/mp3" v-bind="$attrs" />
    <label className="file-button" for="file-input" @click="$emit('click')">
      <slot />
    </label>
  </div>
</template>

<script lang="ts">
export default {
  name: 'FileInput',
  props: {
    fileInputRef: {
      type: () => HTMLInputElement,
      default: 'fileInputRef'
    }
  },
  emits: ['click'],
  setup(props) {
    console.log('* props', props.fileInputRef)
    return {}
  }
}
</script>

<style>
.file-input-wrapper .file-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.file-input-wrapper .file-button:hover {
  background-color: #0056b3;
}
</style>
