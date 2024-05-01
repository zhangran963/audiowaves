import { computed, inject, ref, watch, nextTick, type Ref } from 'vue'

export const useCanvas = () => {
  const canvasRef = ref<HTMLCanvasElement>()
  const ctxRef = computed(() => canvasRef.value?.getContext('2d'))

  watch(canvasRef, async () => {
    const canvasEle = canvasRef.value
    if (!canvasEle) return
    await nextTick()

    const audioViewElement = document.querySelector('.audio-view')
    console.log('* audioViewElement', audioViewElement)
    // console.log('* audioWidth.in  ', audioWidth?.value)
    canvasEle.width = audioViewElement!.clientWidth
    canvasEle.height = 400
  })

  const clearCanvas = () => {
    const canvasEle = canvasRef.value!
    ctxRef.value?.clearRect(0, 0, canvasEle.width, canvasEle.height)
  }

  const fillStyle = (style: string) => {
    ctxRef.value!.fillStyle = style
  }

  const drawRectWithRadius = (x: number, y: number, width: number, height: number) => {
    const ctx = ctxRef.value
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + width, y)
    ctx.lineTo(x + width, y + height)
    ctx.lineTo(x, y + height)
    ctx.lineTo(x, y)
    ctx.closePath()
    ctx.fill()
  }

  const maxFrequency = 3000
  // const minFrequency = 20
  const frequencyInterval = 100
  const draw = (frequencyData: Uint8Array) => {
    const barWidth = canvasRef.value!.width / (maxFrequency / frequencyInterval)
    clearCanvas()
    let barHeight
    let x = 0

    for (let i = 0; i <= maxFrequency; i += frequencyInterval) {
      barHeight = frequencyData[i]
      fillStyle('#000')
      drawRectWithRadius(x, canvasRef.value!.height - barHeight, barWidth - 2, barHeight)

      if ((i / frequencyInterval) % 2 == 0) {
        ctxRef.value!.fillText(`${i} Hz`, x + barWidth / 4, 20) // Position and content of the text
      }

      x += barWidth + 1
    }
  }

  return {
    canvasRef,
    ctxRef,
    clearCanvas,
    fillStyle,
    drawRectWithRadius,
    draw
  }
}
