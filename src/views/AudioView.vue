<template>
  <div>
    <h1>Audio View</h1>
    <input id="audioFile" ref="fileInputRef" type="file" accept="audio/mp3" />
    <canvas id="canvas" ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, watchEffect } from 'vue'
export default {
  name: 'AudioView',
  setup() {
    const fileInputRef = ref<HTMLInputElement>()
    const canvasRef = ref<HTMLCanvasElement>()
    const audioContextRef = ref<AudioContext>()
    const analyserRef = ref<AnalyserNode>()

    watchEffect(() => {
      if (!audioContextRef.value) {
        console.log('* watchEffect[skip]')
        return
      }
      analyserRef.value = audioContextRef.value?.createAnalyser()
      analyserRef.value.fftSize = 2048
      console.log('* watchEffect[analyserRef]', analyserRef.value)
    })
    return {
      fileInputRef,
      canvasRef,
      audioContextRef,
      analyserRef
    }
  }
}
</script>
