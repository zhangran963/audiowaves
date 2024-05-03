<template>
  <div class="audio-view">
    <div class="audio-view-wrapper">
      <div class="audio-view-content">
        <FileInput
          class="audio-view-fileinput"
          accept="audio/*"
          @file-input-mounted="fileInputMounted"
          @change="fileChangeHandle"
          >{{ fileInputName || '请选择音频文件' }}</FileInput
        >
        <div class="voice-line">
          <MyButton @click="decreaseVoice">-</MyButton>
          <span class="voice-line-val">{{ audio.voice.toFixed(1) }}</span>
          <MyButton @click="increaseVoice">+</MyButton>
        </div>
        <!-- 播放控制按钮 -->
        <div class="play-line">
          <div class="play-line-controls">
            <CircleWave :is-animate="playing">
              <IconPause v-if="playing" :disabled="!analyserIsReady" @click="pause"></IconPause>
              <IconPlay v-else :disabled="!analyserIsReady" @click="play"></IconPlay>
            </CircleWave>
          </div>
          <div class="progress-line">
            <div class="progress-line-start">{{ currentTimeStr }}</div>
            <ProgressBar
              v-model="currentTime"
              class="progress-line-box"
              :dragable="analyserIsReady && currentTime > 0"
              :max="duration"
              @stop-drag="onProgressStopDrag"
            />
            <div class="progress-line-end">
              {{ endTimeStr }}
            </div>
          </div>
        </div>
        <canvas id="canvas" ref="canvasRef" class="audio-view-canvas physical-inner"></canvas>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IconPlay, IconPause, FileInput, ProgressBar, CircleWave, MyButton } from '@/components'
import { useData } from './composables'

export default {
  name: 'AudioView',
  components: {
    FileInput,
    ProgressBar,
    IconPlay,
    IconPause,
    CircleWave,
    MyButton
  },
  setup() {
    return {
      ...useData()
    }
  }
}
</script>

<style lang="scss">
.audio-view {
  min-height: 100vh;
  background-color: var(--greyLight-1);

  &-wrapper {
    padding: 20px;
  }

  .voice-line {
    padding: 20px 0 0;
    &-val {
      padding: 0 10px;
    }
  }

  .play-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px 14px;

    &-controls {
      padding: 10px 0px;
      svg {
        vertical-align: bottom;
      }
    }
    .progress-line {
      margin-left: 10px;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      &-box {
        flex: 1;
      }
      &-start,
      &-end {
        width: 50px;
        text-align: center;
      }
    }
  }

  &-canvas {
    margin-top: 10px;
    border-radius: 4px;
  }
}

@media screen and (min-width: 600px) {
  .audio-view {
    display: flex;
    align-items: center;
    justify-content: center;
    &-wrapper {
      width: 80%;
      max-width: 800px;
      margin: 30px 0;
      border-radius: 18px;
      box-shadow:
        0.8rem 0.8rem 1.4rem var(--greyLight-2),
        -0.2rem -0.2rem 1.8rem var(--white);
    }
  }
}
@media screen and (max-width: 600px) {
  .audio-view {
    &-wrapper {
    }
  }
}
</style>
