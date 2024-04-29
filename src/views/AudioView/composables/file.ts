import { ref, computed, watch, watchEffect } from 'vue'

export const useFileInput = () => {
  const fileInputRef = ref<HTMLInputElement>()
  const fileInputMounted = (ele: HTMLInputElement) => {
    fileInputRef.value = ele
  }
  const file = ref<File>()
  const fileInputName = computed(() => file.value?.name || '')
  const fileChangeHandle = async () => {
    const files = fileInputRef.value?.files
    if (!files?.length) return
    file.value = files[0]
    console.log('* file', file.value, fileInputName.value)
  }

  return {
    fileInputRef,
    fileInputMounted,
    fileInputName,
    file,
    fileChangeHandle
  }
}
