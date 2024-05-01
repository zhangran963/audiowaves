import { ref, watch, type Ref } from 'vue'
import { useFileInput } from './file'
import { useCanvas } from './canvas'
import { createFileReader } from '@/utils/file'
import { round } from 'lodash'

const fftSizeMap = {
  1024: 1024,
  2048: 2048,
  4096: 4096,
  8192: 8192
}
type TFftSize = keyof typeof fftSizeMap
export const useAudio = () => {
  const fileInfo = useFileInput()
  const { file } = fileInfo
  const audioElementInfo = useAudioElement(file)
  const canvasInfo = useCanvas()
  const audio = new MyAudio(fftSizeMap['8192'])

  const analyserIsReady = ref(false)
  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)

  watch(file, async () => {
    if (!file.value) return
    stopAnalyser()

    const fileEvent = await createFileReader(file.value!)
    await audio.decodeAudioData(fileEvent.target?.result as ArrayBuffer)
    duration.value = audio.duration
    analyserIsReady.value = true

    // 自动开始
    startAnalyser()
  })

  const drawFrequency = async () => {
    const frequencyData = new Uint8Array(audio.analyser.frequencyBinCount)
    audio.analyser.getByteFrequencyData(frequencyData)
    await canvasInfo.draw(frequencyData)
    requestAnimationFrame(drawFrequency)
  }

  let timer: ReturnType<typeof setInterval>
  const startAnalyser = () => {
    if (!analyserIsReady.value) return
    audio.start()
    drawFrequency()
    playing.value = true

    timer = setInterval(() => {
      currentTime.value = audio.currentTime
      if (currentTime.value >= duration.value) {
        clearInterval(timer)
        stopAnalyser()
        audio.reset()
        currentTime.value = 0
      }
    }, 1000)
  }

  const pauseAnalyser = () => {
    clearInterval(timer)
    audio.pause()
    playing.value = false
  }

  const stopAnalyser = () => {
    clearInterval(timer)
    audio.stop()
    playing.value = false
  }

  const onProgressStopDrag = (progressParams: any) => {
    audio.seek(progressParams.value)
    playing.value = true
  }

  return {
    ...fileInfo,
    ...canvasInfo,
    ...audioElementInfo,
    startAnalyser,
    pauseAnalyser,
    stopAnalyser,
    onProgressStopDrag,
    playing,
    currentTime,
    duration,
    analyserIsReady
  }
}

const useAudioElement = (file: Ref<File | undefined>) => {
  let audioElement: HTMLAudioElement
  const currentTime = ref(0) // 当前播放时间
  const duration = ref(0) // 音频总时长

  watch(file, () => {
    if (!file.value) return
    // 创建音频操作对象
    const fileURL = URL.createObjectURL(file.value)
    audioElement = new Audio(fileURL)
    audioElement.onloadedmetadata = () => {
      duration.value = round(audioElement.duration, 0)
    }
    audioElement.ontimeupdate = () => {
      currentTime.value = audioElement.currentTime
    }
  })

  const playAudio = () => {
    if (audioElement) {
      audioElement.play()
    }
  }

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause()
    }
  }

  const seekAudio = () => {
    if (audioElement) {
      audioElement.currentTime = currentTime.value
    }
  }

  return {
    currentTime,
    duration,
    playAudio,
    pauseAudio,
    seekAudio
  }
}

class MyAudio {
  context: AudioContext
  analyser: AnalyserNode
  private gainNode: GainNode
  private bufferSourceNode?: AudioBufferSourceNode
  private audioBuffer!: AudioBuffer

  private startTime: number = 0
  private pausedTime: number = 0

  constructor(fftSize: number) {
    this.context = new AudioContext()
    this.analyser = this.context.createAnalyser()
    this.gainNode = this.context.createGain()

    this.analyser.fftSize = fftSize
  }

  async decodeAudioData(result: ArrayBuffer) {
    return this.context.decodeAudioData(result).then((buffer) => {
      this.audioBuffer = buffer
      return this
    })
  }

  private createNewSourceAndStart(offset: number) {
    this.bufferSourceNode = this.context.createBufferSource()
    this.bufferSourceNode.buffer = this.audioBuffer
    this.bufferSourceNode.connect(this.analyser)
    this.analyser.connect(this.gainNode)
    this.gainNode.connect(this.context.destination)
    this.bufferSourceNode.start(0, offset)
  }

  start() {
    if (this.isPause) {
      this.createNewSourceAndStart(this.pausedTime)
      this.startTime = this.context.currentTime - this.pausedTime
      this.pausedTime = 0
    } else {
      this.createNewSourceAndStart(0)
      this.startTime = this.context.currentTime
    }
  }

  pause() {
    this.pausedTime = this.context.currentTime - this.startTime
    this.bufferSourceNode?.stop()
  }

  stop() {
    this.bufferSourceNode?.stop()
    this.pausedTime = 0
    this.startTime = 0
  }

  seek(time: number) {
    // 确保 seek 不超出音频时长
    if (time < 0 || time > this.audioBuffer.duration) {
      console.error('Seek time out of bounds')
      return
    }
    this.bufferSourceNode?.stop()
    this.createNewSourceAndStart(time)
    // 更新开始时间和暂停时间
    this.startTime = this.context.currentTime - time
    this.pausedTime = 0
  }

  reset() {
    this.startTime = 0
    this.pausedTime = 0
  }

  get isPause() {
    return this.pausedTime !== 0
  }
  get currentTime() {
    if (this.isPause) {
      return round(this.pausedTime - this.startTime)
    } else {
      return round(this.context.currentTime - this.startTime)
    }
  }
  get duration() {
    return round(this.audioBuffer.duration, 0)
  }
}
