<template>
  <div
    ref="progressBoxRef"
    class="progress-box"
    :class="{ 'is-seekable': seekable }"
    @click="clickProgressBox"
  >
    <div ref="progressRef" class="progress" :style="{ width: progress * 100 + '%' }">
      <div
        ref="progressBtnRef"
        class="progress-btn"
        :class="{ 'is-dragable': dragable, 'is-dragging': isDragging }"
        @mousedown="startDragging"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, toRefs } from 'vue'
import { throttle, round } from 'lodash'
import { limitMaxMin } from '@/utils/math'

export default {
  name: 'ProgressBar',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    seekable: {
      type: Boolean,
      default: false
    },
    dragable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'startDrag', 'dragging', 'stopDrag', 'change'],
  setup(props, ctx) {
    const { modelValue: outerProgressVal, seekable, dragable } = toRefs(props)

    const progressBoxRef = ref<HTMLDivElement>()
    const progressRef = ref<HTMLDivElement>()
    const progressBtnRef = ref<HTMLDivElement>()

    const isDragging = ref(false)

    // 比例
    const outerProgress = computed(() => {
      if (props.max <= 0) return 0
      return outerProgressVal.value / props.max
    })
    // 比例
    const innerProgress = ref(props.modelValue / props.max)
    // 比例
    const progress = computed(() => (isDragging.value ? innerProgress.value : outerProgress.value))

    const progressParams = computed(() => {
      const { max, min } = props
      const duration = max - min
      const progressVal = limitMaxMin(round(innerProgress.value, 2), 1, 0)
      return {
        isDragging: isDragging.value,
        progress: progressVal,
        value: round(min + duration * progressVal, 0)
      }
    })

    const startDragging = () => {
      if (!dragable.value) return
      isDragging.value = true
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDraging)
      ctx.emit('startDrag', progressParams.value)
    }

    const onDragCore = (event: MouseEvent) => {
      innerProgress.value = getNextProgressVal(event)
      ctx.emit('dragging', progressParams.value)
      ctx.emit('change', progressParams.value)
      ctx.emit('update:modelValue', progressParams.value.value)
    }
    const onDrag = throttle(onDragCore, 100, {
      leading: true,
      trailing: true
    })

    const stopDraging = () => {
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDraging)
      isDragging.value = false
      ctx.emit('stopDrag', progressParams.value)
    }

    const clickProgressBox = (event: MouseEvent) => {
      if (!seekable.value) return
      innerProgress.value = getNextProgressVal(event)
      ctx.emit('change', progressParams.value)
      ctx.emit('update:modelValue', progressParams.value.value)
    }

    const getNextProgressVal = (event: MouseEvent | PointerEvent) => {
      if (!progressBoxRef.value) return 0
      const progressBoxEle = progressBoxRef.value
      const progressBoxRect = progressBoxEle.getBoundingClientRect()

      const nextProgress = limitMaxMin(
        round((event.clientX - progressBoxRect.left) / progressBoxRect.width, 2),
        props.max,
        props.min
      )
      return nextProgress
    }

    return {
      progressBoxRef,
      progressBtnRef,
      progressRef,
      progress,
      isDragging,
      startDragging,
      clickProgressBox
    }
  }
}
</script>

<style lang="scss">
.progress-box {
  background: #e0e0e0;
  border-radius: 5px;
  height: 10px;
  margin: 10px;
  box-shadow:
    inset 0.2rem 0.2rem 0.5rem var(--greyLight-2),
    inset -0.2rem -0.2rem 0.5rem var(--white);
  position: relative;

  &.is-seekable {
    cursor: pointer;
  }
}

.progress {
  background: linear-gradient(
    -1deg,
    var(--primary-dark) 0%,
    var(--primary) 50%,
    var(--primary-light) 100%
  );
  border-radius: 5px;
  height: 100%;
  transition: width 0.2s linear;

  position: relative;
  &-btn {
    position: absolute;
    top: -4px;
    right: -8px;

    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: var(--white);
    box-shadow: 0px 0.1rem 0.3rem 0px var(--greyLight-3);

    display: flex;
    justify-content: center;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow:
        inset 0.2rem 0.2rem 0.5rem var(--greyLight-2),
        inset -0.2rem -0.2rem 0.5rem var(--white);
    }

    &.is-dragable {
      cursor: pointer;
    }
  }
}
</style>
