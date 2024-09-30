<template>
  <RouterView />
  <Notifications position="bottom right" />
</template>
<script setup lang="ts">
import { Notifications } from '@kyvg/vue3-notification'
import { RouterView } from 'vue-router'
</script>
<style scoped></style>
