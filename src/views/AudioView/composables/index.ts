import { watch } from 'vue'
import { useAudio } from './audio'
import { useFileInput } from './file'
import { createFileReader } from '@/utils/file'
import { useCanvas } from './canvas'

export const useData = () => {
  const fileInputInfos = useFileInput()
  const { file } = fileInputInfos
  const audioInfos = useAudio()
  const { audioContextRef, analyserRef } = audioInfos
  const canvasInfo = useCanvas()

  watch(file, async () => {
    linkFileAndAnalyser()
  })

  const linkFileAndAnalyser = async () => {
    const fileEvent = await createFileReader(file.value!)

    audioContextRef.value.decodeAudioData(fileEvent.target?.result as ArrayBuffer, (buffer) => {
      console.log('* ', buffer)

      const source = audioContextRef.value.createBufferSource()
      source.buffer = buffer
      source.connect(analyserRef.value!)
      analyserRef.value?.connect(audioContextRef.value.destination)
      source.start(0)
    })
  }

  const drawFrequency = () => {
    const maxFrequency = 3000
    const minFrequency = 20
    const frequencyInterval = 100
  }

  return {
    ...fileInputInfos,
    ...audioInfos,
    ...canvasInfo
  }
}
