<template>
  <div>
    <FileInput
      accept="audio/mp3"
      @file-input-mounted="fileInputMounted"
      @change="handleFileChange"
      >{{ fileInputName || '请选择音频文件' }}</FileInput
    >
    <canvas id="canvas" ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, ref, watchEffect } from 'vue'
import FileInput from '@/components/FileInput.vue'

export default {
  name: 'AudioView',
  components: {
    FileInput
  },
  setup() {
    const fileInputRef = ref<HTMLInputElement>()
    const fileInputName = computed(() => fileInputRef.value?.files?.[0]?.name || '')
    const canvasRef = ref<HTMLCanvasElement>()
    const audioContextRef = ref<AudioContext>(new AudioContext())
    const analyserRef = ref<AnalyserNode>()

    const fileInputMounted = (val: HTMLInputElement) => {
      fileInputRef.value = val
    }

    watchEffect(() => {
      if (!audioContextRef.value) {
        // console.log('* watchEffect[skip]')
        return
      }
      analyserRef.value = audioContextRef.value?.createAnalyser()
      analyserRef.value.fftSize = 8192
      console.log('* watchEffect[analyserRef]', analyserRef.value)
    })

    const handleFileChange = () => {
      const files = fileInputRef.value?.files
      if (!files || files.length === 0) {
        return
      }
      const file = files[0]
      if (file) {
        console.log('* handleFileChange[files]', file)
        const reader = new FileReader()
        reader.onload = (fileEvent) => {
          // console.log('* reader.onload', fileEvent.target?.result)
          audioContextRef.value?.decodeAudioData(
            fileEvent.target?.result as ArrayBuffer,
            (buffer) => {
              console.log('* ', buffer)
              const source = audioContextRef.value.createBufferSource()
              source.buffer = buffer
              source.connect(analyserRef.value!)
              analyserRef.value!.connect(audioContextRef.value.destination)
              source.start(0)
              drawFrequency()
            }
          )
        }
        reader.readAsArrayBuffer(file)
      }
    }

    const drawFrequency = () => {
      const canvas = canvasRef.value!
      const ctx = canvas?.getContext('2d')
      if (!ctx) {
        console.log('* drawFrequency[skip]')
        return
      }

      canvas.width = window.innerWidth
      canvas.height = 400

      const freqLabels = 3000 // Max frequency to display
      const labelInterval = 100 // Interval for labels
      const barWidth = canvas.width / (freqLabels / labelInterval)
      const radius = 5 // Radius for rounded corners

      const draw = () => {
        const freqData = new Uint8Array(analyserRef.value!.frequencyBinCount)
        analyserRef.value!.getByteFrequencyData(freqData)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const barWidth = canvas.width / (freqLabels / labelInterval)
        let barHeight
        let x = 0

        for (let i = 0; i <= freqLabels; i += labelInterval) {
          barHeight = freqData[i]
          // ctx.fillStyle = '#000';
          // ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

          const hue = (i / freqLabels) * 360 // Color change with frequency

          // Set color and draw rounded rectangle
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`
          drawRoundedRect(ctx, x, canvas.height - barHeight, barWidth - 2, barHeight, radius)

          // Draw frequency labels
          ctx.fillStyle = '#000' // Text color
          ctx.font = '12px Arial' // Text font and size
          // ctx.fillText(`${i} Hz`, x + (barWidth / 4), canvas.height - 5); // Position and content of the text
          ctx.fillText(`${i} Hz`, x + barWidth / 4, 20) // Position and content of the text

          x += barWidth + 1
        }

        requestAnimationFrame(draw)
      }

      draw()
    }

    function drawRoundedRect(ctx, x, y, width, height, radius) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
      ctx.fill()
    }
    return {
      fileInputRef,
      fileInputName,
      canvasRef,
      handleFileChange,
      fileInputMounted
    }
  }
}
</script>

<style>
#canvas {
  width: 100%;
  border: 2px solid lightblue;
  border-radius: 8px;
  margin-top: 20px;
}

.audioFile {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}
</style>
