<template>
  <div class="my-btn" :class="`my-btn__${type}`">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MyButton',
  props: {
    type: {
      type: String as () => 'primary' | 'secondary',
      default: 'primary'
    }
  }
})
</script>

<style lang="scss">
.my-btn {
  min-width: 80px;
  height: 40px;
  border-radius: 4px;
  box-shadow:
    0.3rem 0.3rem 0.6rem var(--greyLight-2),
    -0.2rem -0.2rem 0.5rem var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
  user-select: none;
}

.my-btn__primary {
  background: var(--primary);
  box-shadow:
    inset 0.2rem 0.2rem 1rem var(--primary-light),
    inset -0.2rem -0.2rem 1rem var(--primary-dark),
    0.3rem 0.3rem 0.6rem var(--greyLight-2),
    -0.2rem -0.2rem 0.5rem var(--white);
  color: var(--greyLight-1);
}

.my-btn__secondary {
  color: var(--greyDark);
}
</style>
