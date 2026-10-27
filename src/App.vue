<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Placeholder: shows that the ingress routes /api to the backend.
const apiStatus = ref<string>('checking…')

onMounted(async () => {
  try {
    const response = await fetch('/api/healthz')
    const body: { status: string } = await response.json()
    apiStatus.value = body.status
  } catch {
    apiStatus.value = 'unreachable'
  }
})
</script>

<template>
  <h1>CragRadar</h1>
  <p>API: {{ apiStatus }}</p>
</template>
