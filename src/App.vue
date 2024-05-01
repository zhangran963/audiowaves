<script setup lang="ts">
import { onBeforeMount, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

const appWidth = ref(window.innerWidth)
provide('appWidth', appWidth)
onBeforeMount(() => {
  const appElement = document.querySelector('#app')
  if (appElement) {
    appWidth.value = appElement!.clientWidth
  }
})
</script>

<template>
  <RouterView />
</template>
