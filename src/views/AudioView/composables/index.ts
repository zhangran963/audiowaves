import { computed } from 'vue'
import { useAudio } from './audio'
import { dayjs } from '@/utils/time'

export const useData = () => {
  const audioInfos = useAudio()
  const { analyserIsReady, currentTime, duration } = audioInfos

  const currentTimeStr = computed(() => {
    if (analyserIsReady.value) {
      return dayjs.duration(currentTime.value, 'seconds').format('mm:ss')
    } else {
      return '--:--'
    }
  })

  const endTimeStr = computed(() => {
    if (analyserIsReady.value) {
      return dayjs.duration(duration.value, 'seconds').format('mm:ss')
    } else {
      return '--:--'
    }
  })

  const play = () => {
    // audioInfos.playAudio()
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
