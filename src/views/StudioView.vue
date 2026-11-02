<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Upload } from 'tus-js-client'

import { listImages, PENDING_IMAGE_STATUSES, type ImageSummary } from '../api'
import { startImageUpload } from '../upload'

const STATUS_REFRESH_MILLISECONDS = 3000

const fileInput = ref<HTMLInputElement | null>(null)
const currentUpload = ref<Upload | null>(null)
const uploadFileName = ref('')
const sentBytes = ref(0)
const totalBytes = ref(0)
const uploadError = ref<string | null>(null)
const images = ref<ImageSummary[]>([])
const listError = ref<string | null>(null)
let refreshTimer: number | undefined

const isUploading = computed(() => currentUpload.value !== null)
const uploadPercent = computed(() =>
  totalBytes.value === 0 ? 0 : Math.floor((sentBytes.value / totalBytes.value) * 100),
)
const hasPendingImages = computed(() =>
  images.value.some((image) => PENDING_IMAGE_STATUSES.includes(image.status)),
)

async function refreshImages(): Promise<void> {
  try {
    images.value = await listImages()
    listError.value = null
  } catch (error) {
    listError.value = error instanceof Error ? error.message : String(error)
  }
}

function chooseFile(): void {
  fileInput.value?.click()
}

function uploadChosenFile(event: Event): void {
  const input = event.target as HTMLInputElement
  const file: File | undefined = input.files?.[0]
  input.value = ''
  if (file === undefined) {
    return
  }
  uploadFileName.value = file.name
  sentBytes.value = 0
  totalBytes.value = file.size
  uploadError.value = null
  currentUpload.value = startImageUpload(file, {
    onProgress: (sent, total) => {
      sentBytes.value = sent
      totalBytes.value = total
    },
    onSuccess: () => {
      currentUpload.value = null
      void refreshImages()
    },
    onError: (message) => {
      currentUpload.value = null
      uploadError.value = message
    },
  })
}

function cancelUpload(): void {
  void currentUpload.value?.abort(true)
  currentUpload.value = null
}

function formatMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

onMounted(() => {
  void refreshImages()
  refreshTimer = window.setInterval(() => {
    if (hasPendingImages.value) {
      void refreshImages()
    }
  }, STATUS_REFRESH_MILLISECONDS)
})

onUnmounted(() => window.clearInterval(refreshTimer))
</script>

<template>
  <section class="space-y-6">
    <h2 class="text-xl font-bold">Content creation</h2>

    <div class="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <input
        ref="fileInput"
        type="file"
        accept="image/*,.tif,.tiff"
        class="hidden"
        data-testid="image-file-input"
        @change="uploadChosenFile"
      />
      <button
        type="button"
        class="w-full rounded-lg bg-stone-900 px-4 py-3 text-lg font-semibold text-white disabled:opacity-50"
        :disabled="isUploading"
        @click="chooseFile"
      >
        Upload image
      </button>

      <div v-if="isUploading" class="mt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="truncate pr-2 font-medium">{{ uploadFileName }}</span>
          <span class="shrink-0 text-stone-500">
            {{ formatMegabytes(sentBytes) }} / {{ formatMegabytes(totalBytes) }}
          </span>
        </div>
        <div class="h-2 overflow-hidden rounded-full bg-stone-200">
          <div class="h-full bg-emerald-600 transition-all" :style="{ width: `${uploadPercent}%` }" />
        </div>
        <button type="button" class="text-sm text-stone-500 underline" @click="cancelUpload">
          Cancel
        </button>
      </div>
      <p v-if="uploadError !== null" class="mt-3 text-sm text-red-700">
        Upload failed: {{ uploadError }}
      </p>
    </div>

    <div class="space-y-2">
      <h3 class="font-semibold">Images</h3>
      <p v-if="listError !== null" class="text-sm text-red-700">{{ listError }}</p>
      <p v-else-if="images.length === 0" class="text-sm text-stone-500">No images yet.</p>
      <ul class="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        <li v-for="image in images" :key="image.id" class="flex items-center justify-between gap-3 p-3">
          <div class="min-w-0">
            <p class="truncate font-medium">{{ image.file_name }}</p>
            <p class="text-xs text-stone-500">
              {{ formatMegabytes(image.size_bytes) }}
              <template v-if="image.width !== null"> · {{ image.width }} × {{ image.height }}</template>
            </p>
            <p v-if="image.error !== null" class="text-xs text-red-700">{{ image.error }}</p>
          </div>
          <span
            class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
            :class="{
              'bg-emerald-100 text-emerald-800': image.status === 'ready',
              'bg-red-100 text-red-800': image.status === 'failed',
              'bg-amber-100 text-amber-800': PENDING_IMAGE_STATUSES.includes(image.status),
            }"
          >
            {{ image.status }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
