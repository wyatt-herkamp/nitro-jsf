<template>
  <main>
    <h1>Upload Schema</h1>
    <UploadFileBox @fileAdded="onFileAdded" />
  </main>
</template>

<script setup lang="ts">
import UploadFileBox from '@/components/UploadFileBox.vue'
import { ref } from 'vue'
import router from '@/router'

const rawFile = ref<string | undefined>(undefined)
function onFileAdded(fileAsString: string) {
  rawFile.value = fileAsString
  // Convert the file to base64
  const encodedFile = btoa(fileAsString)
  // Set Current Query Param
  router.push({
    name: 'debug',
    params: {
      fileContent: encodedFile
    }
  })
}
</script>
