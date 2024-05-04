import { computed } from 'vue'
import { useAudio } from './audio'
import { dayjs } from '@/utils/time'

export const useData = () => {
  const audioInfos = useAudio()
  const { analyserIsReady, audio } = audioInfos

  const currentTimeStr = computed(() => {
    if (analyserIsReady.value) {
      return dayjs.duration(audio.value.currentTime, 'seconds').format('mm:ss')
    } else {
      return '--:--'
    }
  })

  const endTimeStr = computed(() => {
    if (analyserIsReady.value) {
      return dayjs.duration(audio.value.duration, 'seconds').format('mm:ss')
    } else {
      return '--:--'
    }
  })

  const play = () => {
    audioInfos.startAnalyser()
  }

  const pause = () => {
    audioInfos.pauseAnalyser()
  }

  return {
    ...audioInfos,
    currentTimeStr,
    endTimeStr,
    play,
    pause
  }
}
