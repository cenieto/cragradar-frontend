<script setup lang="ts">
import { logout } from '../auth'
</script>

<template>
  <section class="mx-auto max-w-md space-y-4 text-center">
    <h2 class="text-2xl font-bold">Made for your phone</h2>
    <p class="text-stone-600">
      CragRadar shows its content on mobile phones only. Open this address on your phone to see the
      crags.
    </p>
    <button
      type="button"
      class="rounded-lg border border-stone-300 px-4 py-2 font-medium"
      @click="logout"
    >
      Sign out
    </button>
  </section>
</template>
