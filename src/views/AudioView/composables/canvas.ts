import { round } from 'lodash'
import { computed, ref, watch } from 'vue'

export const useCanvas = () => {
  const canvasRef = ref<HTMLCanvasElement>()
  const ctxRef = computed(() => canvasRef.value?.getContext('2d'))
  // Unit8Arrya范围 0~255; 计算比例因子
  const heightFactor = computed(() =>
    canvasRef.value ? round(canvasRef.value?.height / 255, 2) : 0
  )
  const barWidth = computed(() =>
    canvasRef.value
      ? round((canvasRef.value.width - edge * 2) / (maxFrequency / frequencyInterval), 2)
      : 0
  )

  watch(canvasRef, async () => {
    const canvasEle = canvasRef.value!
    const audioViewElement = document.querySelector('.audio-view-content')!
    canvasEle.width = audioViewElement.clientWidth
    canvasEle.height = audioViewElement.clientWidth * 0.6
  })

  const maxFrequency = 3000
  const frequencyInterval = 100
  const edge = 10
  const draw = (frequencyData: Uint8Array) => {
    const canvasEle = canvasRef.value!
    const ctx = ctxRef.value
    if (!ctx || !canvasEle) return
    ctx.clearRect(0, 0, canvasEle.width, canvasEle.height)

    setupColors()
    // 柱形图的宽
    let x = edge
    for (let i = 0; i <= maxFrequency; i += frequencyInterval) {
      // 柱形图的高
      const barHeight = frequencyData[i] * heightFactor.value * 0.9

      // 音调高 -> barHeight高 -> (canvasEle.height - barHeight)低 -> 从下面看, 高
      drawRectWithRadius(x, canvasEle.height - barHeight, barWidth.value - 2, barHeight)
      // 文本
      if ((i / frequencyInterval) % 2 == 0) {
        ctx.fillText(`${i + frequencyInterval}Hz`, x, 20)
      }

      // 起始值
      x += barWidth.value
    }
  }

  const drawRectWithRadius = (x: number, y: number, width: number, height: number) => {
    if (!height) return
    const ctx = ctxRef.value!
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.lineTo(x + width, y + height)
    ctx.lineTo(x, y + height)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.fill()
  }

  const setupColors = () => {
    const ctx = ctxRef.value!
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.value!.height)
    gradient.addColorStop(0, '#5b0eeb')
    gradient.addColorStop(1, '#8abdff')
    ctx.fillStyle = gradient
  }

  return {
    canvasRef,
    ctxRef,
    draw
  }
}
