import { ref, watchEffect } from 'vue'

const fftSizeMap = {
  1024: 1024,
  2048: 2048,
  4096: 4096,
  8192: 8192
}
export const useAudio = () => {
  const audioContextRef = ref<AudioContext>(new AudioContext())
  const analyserRef = ref<AnalyserNode>()

  watchEffect(() => {
    if (!audioContextRef.value) return

    analyserRef.value = audioContextRef.value.createAnalyser()
    analyserRef.value.fftSize = fftSizeMap[8192]
  })

  return {
    audioContextRef,
    analyserRef
  }
}
