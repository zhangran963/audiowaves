import { ref, watch } from 'vue'
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

export const useAudio = () => {
  const fileInfo = useFileInput()
  const { file } = fileInfo
  const canvasInfo = useCanvas()
  const audio = ref(new MyAudio(fftSizeMap['8192']))

  const analyserIsReady = ref(false)
  const playing = ref(false)

  const startAnalyser = () => {
    if (!analyserIsReady.value) return
    audio.value.start()
    const drawFrequency = () => {
      const frequencyData = new Uint8Array(audio.value.analyser.frequencyBinCount)
      audio.value.analyser.getByteFrequencyData(frequencyData)
      canvasInfo.draw(frequencyData)
      requestAnimationFrame(drawFrequency)
    }
    drawFrequency()
    playing.value = true
  }

  const pauseAnalyser = () => {
    audio.value.pause()
    playing.value = false
  }

  const stopAnalyser = () => {
    audio.value.stop()
    playing.value = false
  }

  const onProgressStopDrag = (progressParams: any) => {
    audio.value.seek(progressParams.value)
    playing.value = true
  }

  const decreaseVoice = () => (audio.value.voice -= 0.1)
  const increaseVoice = () => (audio.value.voice += 0.1)

  watch(file, async () => {
    if (!file.value) return
    stopAnalyser()

    const fileEvent = await createFileReader(file.value!)
    await audio.value.decodeAudioData(fileEvent.target?.result as ArrayBuffer)
    analyserIsReady.value = true

    // 自动开始
    startAnalyser()
  })

  watch(
    () => audio.value.currentTime,
    () => {
      const { currentTime, duration } = audio.value
      if (currentTime >= duration) {
        stopAnalyser()
      }
    }
  )

  return {
    ...fileInfo,
    ...canvasInfo,
    startAnalyser,
    pauseAnalyser,
    stopAnalyser,
    onProgressStopDrag,
    decreaseVoice,
    increaseVoice,
    playing,
    analyserIsReady,
    audio
  }
}

class MyAudio {
  private context: AudioContext
  public analyser: AnalyserNode
  private gainNode: GainNode
  private bufferSourceNode?: AudioBufferSourceNode
  private audioBuffer!: AudioBuffer

  private startTime: number = 0
  private pausedTime: number = 0
  public currentTime: number = 0
  private intervalTimer!: ReturnType<typeof setInterval>

  constructor(fftSize: number) {
    this.context = new AudioContext()
    this.analyser = this.context.createAnalyser()
    this.gainNode = this.context.createGain()
    this.analyser.fftSize = fftSize
    this.voice = 0.5
  }

  public async decodeAudioData(result: ArrayBuffer) {
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

  public start() {
    if (this.isPause) {
      this.createNewSourceAndStart(this.pausedTime)
      this.startTime = this.context.currentTime - this.pausedTime
      this.pausedTime = 0
    } else {
      this.createNewSourceAndStart(0)
      this.startTime = this.context.currentTime
    }
    this.intervalTimer = setInterval(() => {
      this.currentTime = this.__getCurrentTime()
    }, 1000)
  }

  public pause() {
    clearInterval(this.intervalTimer)
    this.pausedTime = this.context.currentTime - this.startTime
    this.bufferSourceNode?.stop()
  }

  public stop() {
    clearInterval(this.intervalTimer)
    this.bufferSourceNode?.stop()
    this.reset()
  }

  public seek(time: number) {
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

  private reset() {
    this.startTime = 0
    this.pausedTime = 0
    this.currentTime = 0
  }

  get isPause() {
    return this.pausedTime !== 0
  }
  private __getCurrentTime() {
    if (this.isPause) {
      return round(this.pausedTime - this.startTime)
    } else {
      return round(this.context.currentTime - this.startTime)
    }
  }
  get duration() {
    return this.audioBuffer ? round(this.audioBuffer.duration, 0) : 0
  }
  get voice() {
    return round(this.gainNode.gain.value, 1)
  }
  set voice(val) {
    const nextVal = round(val, 1)
    if (nextVal >= 0 && nextVal <= 1) {
      this.gainNode.gain.value = nextVal
    }
  }
}
