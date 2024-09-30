<template>
  <main v-if="parsedFile">
    <DebugParent :schema="parsedFile" />
  </main>
</template>
<script setup lang="ts">
import router from '@/router'
import { ref, watch } from 'vue'
import { parseJsonSchema, type SchemaForm } from '../../../dist/lib'
import DebugParent from '@/components/schema/debug/DebugParent.vue'
const parsedFile = ref<SchemaForm | undefined>(undefined)
const error = ref<Error | undefined>(undefined)
const base64File = ref<string | undefined>(router.currentRoute.value.params.fileContent as string)
const rawFile = ref<string | undefined>(undefined)
decryptFile()
parseFile()
function decryptFile() {
  if (!base64File.value) {
    console.error('No file to decrypt')
    return
  }
  try {
    const decodedFile = atob(base64File.value)
    rawFile.value = decodedFile
    console.log('Decoded file', decodedFile)
  } catch (e) {
    console.error('Error decrypting file', e)
    error.value = e as Error
  }
}
function parseFile() {
  if (!rawFile.value) {
    console.error('No file to parse')
    return
  }

  try {
    const parsed = parseJsonSchema(rawFile.value)
    console.log('Parsed schema', parsed)
    parsedFile.value = parsed
  } catch (e) {
    console.error('Error parsing schema', e)
    error.value = e as Error
  }
}
</script>
