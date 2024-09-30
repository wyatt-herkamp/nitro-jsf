<template>
  <div id="upload" @click="onClick">
    <div
      class="uploadBox"
      v-if="state == State.GettingFile"
      id="fileInputBox"
      @drop="dropHandler"
      ref="formInput"
      @dragover="preventDefaults"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
    >
      <input
        class="dropBox"
        type="file"
        name="file"
        id="file"
        ref="fileInput"
        @change="onFileAdd"
      />
      <label for="file">Select a File or Drag Into Here</label>
    </div>
    <div class="uploadBox" v-else-if="state == State.ParsingFile">Parsing...</div>
    <div class="uploadBox" v-else-if="state == State.Done">Done!</div>
  </div>
</template>

<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

const emit = defineEmits<{
  (e: 'fileAdded', fileAsString: string): void
}>()
const events = ['dragenter', 'dragover', 'dragleave', 'drop']
const formInput: Ref<HTMLFormElement | undefined> = ref(undefined)
function preventDefaults(e: Event) {
  e.preventDefault()
}
function onDragEnter(e: DragEvent) {
  formInput.value?.classList.add('highlight')
  e.preventDefault()
}
function onDragLeave(e: DragEvent) {
  formInput.value?.classList.remove('highlight')
  e.preventDefault()
}
onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults)
  })
})
onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults)
  })
})
enum State {
  GettingFile,
  ParsingFile,
  Done
}
const state: Ref<State> = ref(State.GettingFile)

const fileInput: Ref<HTMLInputElement | undefined> = ref(undefined)
function dropHandler(event: DragEvent) {
  console.log('File(s) dropped ' + event)
  if (!event.dataTransfer) {
    console.log('No data transfer')
    return
  }

  if (event.dataTransfer.items) {
    console.log(
      `Data transfer items length ${event.dataTransfer.items.length} + ${event.dataTransfer.items}`
    )
    console.log(
      `Data Transfer Files length ${event.dataTransfer.files.length} + ${event.dataTransfer.files}`
    )
    if (fileInput.value) {
      fileInput.value.files = event.dataTransfer.files
      onFileAdd()
    }
  }
}
function onClick() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}
async function onFileAdd() {
  console.log(`fileInput.value.files ${fileInput.value?.files}`)
  if (!fileInput.value) {
    console.error('No file input')
    return
  }
  if (fileInput.value.files?.length !== 1) {
    notify({
      type: 'error',
      title: 'Error Uploading File',
      text: 'Please upload only one file.'
    })
    fileInput.value.files = null
    State.GettingFile
    return
  }
  if (fileInput.value?.files) {
    state.value = State.ParsingFile

    try {
      const file = fileInput.value.files[0]
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const fileAsString = await file.text()
      //TODO: Make sure it is a json file
      // All other parsing logic should happen in the parent component
      emit('fileAdded', fileAsString)
      state.value = State.Done
    } catch (e) {
      notify({
        type: 'error',
        title: 'Error Uploading File',
        text: 'Please try again.'
      })
      state.value = State.GettingFile
    }
  }
}
</script>
<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  #howToUpload {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
}

#upload {
  width: 35rem;
  height: 20rem;
  padding: 1rem;

  #file {
    display: none;
  }

  #fileInputBox {
    &:hover {
      cursor: pointer;

      border: 2px dashed green;
    }
  }
}

.uploadBox {
  width: 100%;
  height: 100%;
  border: 2px dashed black;
}

.highlight {
  box-shadow: 0 0 50px 15px #68a263;
}
</style>
