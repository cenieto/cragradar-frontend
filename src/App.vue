<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { isContentEditor, logout, session } from './auth'
</script>

<template>
  <div class="min-h-dvh bg-stone-50 text-stone-900">
    <header class="sticky top-0 z-10 border-b border-stone-200 bg-white/95 px-4 pb-2 pt-3 backdrop-blur">
      <h1 class="text-center text-4xl font-extrabold tracking-tight sm:text-5xl">CragRadar</h1>
      <nav
        v-if="session.user !== null"
        class="mt-2 flex items-center justify-center gap-5 text-sm font-medium text-stone-600"
      >
        <RouterLink to="/" class="hover:text-stone-900" active-class="text-stone-900">Home</RouterLink>
        <RouterLink
          v-if="isContentEditor"
          to="/studio"
          class="hover:text-stone-900"
          active-class="text-stone-900"
        >
          Content creation
        </RouterLink>
        <button type="button" class="hover:text-stone-900" @click="logout">Sign out</button>
      </nav>
    </header>
    <main class="mx-auto w-full max-w-3xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
