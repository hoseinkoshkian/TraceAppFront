<!-- src/components/Header.vue -->
<script setup>
import { ref } from 'vue'

const user = ref({ username: 'hosein' })

defineEmits(['toggle-sidebar'])
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
    <div class="flex items-center justify-between px-6 py-4">

      <!-- دکمه منوی موبایل -->
      <button
          @click="$emit('toggle-sidebar')"
          id="menu-toggle"
          class="lg:hidden text-primary-600 text-2xl hover:scale-110 transition"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- عنوان -->
      <div class="text-center flex-1 lg:flex-initial">
        <h1 class="text-2xl md:text-3xl font-bold text-primary-600">ایستگاه کنترل</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">ماموریت‌های شما در حال اجراست...</p>
      </div>

      <!-- کاربر -->
      <div class="flex items-center gap-4">
        <div class="avatar bg-primary-100 dark:bg-primary-900 w-12 h-12 rounded-full flex items-center justify-center">
          <i class="fas fa-user-astronaut text-primary-600 text-xl"></i>
        </div>
        <div class="hidden sm:block text-right">
          <p class="text-xs text-slate-500 dark:text-slate-400">سلام، فرمانده</p>
          <p class="font-bold text-slate-800 dark:text-white">{{ user.username }}</p>
        </div>
      </div>
    </div>
  </header>
</template>