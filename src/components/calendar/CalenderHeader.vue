<template>
  <header class="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-30">
    <div class="px-4 py-3 flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
      <!-- سمت چپ: عنوان ماه + دکمه امروز -->
      <div class="flex items-center gap-3 min-w-0">
        <h1 class="text-xl font-semibold text-gray-900 truncate">
          {{ monthTitle }}
        </h1>
        <button
            @click="$emit('today')"
            class="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition whitespace-nowrap"
        >
          امروز
        </button>
      </div>

      <!-- وسط: ناوبری ماه -->
      <div class="flex items-center gap-1">
        <button
            @click="$emit('prev')"
            class="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="ماه قبل"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
            @click="$emit('next')"
            class="p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="ماه بعد"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- سمت راست: دکمه‌های ویو (فقط دسکتاپ) -->
      <div class="hidden lg:flex items-center gap-2">
        <button
            v-for="v in views"
            :key="v.value"
            @click="$emit('set-view', v.value)"
            :class="[
            'px-4 py-1.5 text-sm font-medium rounded-lg transition',
            view === v.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ v.label }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentMonth: { type: Object, required: true },
  view: { type: String, required: true }
})

const emit = defineEmits(['prev', 'next', 'today', 'set-view'])

const monthTitle = computed(() => {
  return props.currentMonth.format('jMMMM jYYYY')
})

const views = [
  { label: 'ماه', value: 'month' },
  { label: 'هفته', value: 'week' },
  { label: 'روز', value: 'day' }
]
</script>