<template>
  <div class="audio-view">
    <FileInput
      class="audio-view-fileinput"
      accept="audio/mp3"
      @file-input-mounted="fileInputMounted"
      @change="fileChangeHandle"
      >{{ fileInputName || '请选择音频文件' }}</FileInput
    >

    <!-- 播放控制按钮 -->
    <div class="play-line">
      <div class="play-line-controls">
        <IconPause v-if="playing" :disabled="!analyserIsReady" @click="pause"></IconPause>
        <IconPlay v-else :disabled="!analyserIsReady" @click="play"></IconPlay>
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
    <canvas id="canvas" ref="canvasRef" class="audio-view-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { IconPlay, IconPause, FileInput, ProgressBar } from '@/components'
import { useData } from './composables'

export default {
  name: 'AudioView',
  components: {
    FileInput,
    ProgressBar,
    IconPlay,
    IconPause
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
  padding: 10px 0;
  &-fileinput {
  }

  .play-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 14px 14px;

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
    border-radius: 8px;
    box-shadow: 0 12px 32px 0 hsla(0, 0%, 5%, 0.08);
  }
}
</style>
