<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { isContentEditor } from '../auth'
</script>

<template>
  <section class="space-y-4">
    <h2 class="text-xl font-bold">Locations</h2>
    <p class="text-stone-500">No locations yet.</p>
    <RouterLink
      v-if="isContentEditor"
      to="/studio"
      class="inline-block rounded-lg bg-stone-900 px-4 py-2 font-semibold text-white"
    >
      Go to content creation
    </RouterLink>
  </section>
</template>
