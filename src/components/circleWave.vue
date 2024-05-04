<template>
  <div class="circle">
    <span class="circle__btn" :class="{ shadow: isAnimate }">
      <slot />
    </span>
    <span class="circle__back-1" :class="{ paused: !isAnimate }"></span>
    <span v-show="showCircle2" class="circle__back-2" :class="{ paused: !isAnimate }"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue'

export default defineComponent({
  name: 'CircleWave',
  props: {
    isAnimate: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { isAnimate } = toRefs(props)
    const showCircle2 = ref(false)
    watch(
      isAnimate,
      (val) => {
        if (val) {
          // 圈2 较 圈1 延后
          setTimeout(() => {
            showCircle2.value = true
          }, 2000)
        }
      },
      {
        once: true // 仅初始时, 隐藏"圈2"
      }
    )

    return {
      showCircle2
    }
  }
})
</script>

<style lang="scss">
$outer-shadow:
  0.3rem 0.3rem 0.6rem var(--greyLight-2),
  -0.2rem -0.2rem 0.5rem var(--white);
$inner-shadow:
  inset 0.2rem 0.2rem 0.5rem var(--greyLight-2),
  inset -0.2rem -0.2rem 0.5rem var(--white);

.circle {
  grid-column: 2 / 3;
  grid-row: 4 / 6;
  justify-self: center;
  border-radius: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;

  &__btn {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    padding: 6px;
    display: flex;
    margin: 0.6rem;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 3.2rem;
    color: var(--primary);
    z-index: 300;
    background: var(--greyLight-1);
    box-shadow: $outer-shadow;
    cursor: pointer;
    position: relative;
    &.shadow {
      box-shadow: $inner-shadow;
    }

    .play {
      position: absolute;
      opacity: 0;
      transition: all 0.2s linear;
      &.visibility {
        opacity: 1;
      }
    }
    .pause {
      position: absolute;
      transition: all 0.2s linear;
      &.visibility {
        opacity: 0;
      }
    }
  }

  &__back-1,
  &__back-2 {
    grid-row: 1 / 2;
    grid-column: 1 / 2;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    filter: blur(1px);
    z-index: 100;
  }

  &__back-1,
  &__back-2 {
    box-shadow:
      0.4rem 0.4rem 0.8rem var(--greyLight-2),
      -0.4rem -0.4rem 0.8rem var(--white);
    animation: waves 4s linear infinite;

    &.paused {
      animation-play-state: paused;
    }
  }
}

@keyframes waves {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  33% {
    transform: scale(1);
    opacity: 1;
  }

  67% {
    opacity: 1;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
