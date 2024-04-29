import { computed, ref, watch } from 'vue'

export const useCanvas = () => {
  const canvasRef = ref<HTMLCanvasElement>()
  const ctx = computed(() => canvasRef.value?.getContext('2d'))

  watch(canvasRef, () => {
    console.log('* watch[canvasRef]', ctx.value)
    const canvasEle = canvasRef.value
    if (!canvasEle) return
    canvasEle.width = window.innerWidth
    canvasEle.height = 400
  })

  return {
    canvasRef,
    ctx
  }
}
