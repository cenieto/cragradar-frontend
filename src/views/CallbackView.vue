<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, type Router } from 'vue-router'

import { completeLogin } from '../auth'

const router: Router = useRouter()
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    await router.replace(await completeLogin())
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : String(error)
  }
})
</script>

<template>
  <p v-if="errorMessage === null" class="text-center text-stone-500">Signing in…</p>
  <div v-else class="space-y-3 text-center">
    <p class="text-red-700">Sign-in failed: {{ errorMessage }}</p>
    <a href="/" class="font-medium underline">Try again</a>
  </div>
</template>
