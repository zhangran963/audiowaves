<template>
  <div>
    <FileInput
      accept="audio/mp3"
      @file-input-mounted="fileInputMounted"
      @change="fileChangeHandle"
      >{{ fileInputName || '请选择音频文件' }}</FileInput
    >
    <div>{{ file?.name }}</div>
    <canvas id="canvas" ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import FileInput from '@/components/FileInput.vue'
import { useData } from './composables'

export default {
  name: 'AudioView',
  components: {
    FileInput
  },
  setup() {
    return {
      ...useData()
    }
  }
}
</script>
