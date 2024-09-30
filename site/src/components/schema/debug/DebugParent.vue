<template>
  <div>
    <h1>{{ schema.title }}</h1>
  </div>
  <div class="properties">
    <div v-for="property in schema.primary.properties" :key="property.key">
      <h2>{{ property.key() }}</h2>
    </div>
    <div v-if="schema.primary.condition">
      <div v-for="property in schema.primary.condition.extraProperties" :key="property.key">
        <h2>{{ property.key() }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { SchemaForm } from '../../../../../dist/lib'

const props = defineProps({
  schema: {
    type: Object as PropType<SchemaForm>,
    required: true
  }
})
</script>
