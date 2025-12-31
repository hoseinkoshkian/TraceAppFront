<!-- src/components/Header.vue -->
<script setup>
import { ref } from 'vue'

const user = ref({
  username: 'hosein',
  fullName: 'حسین احمدی'
})

defineEmits(['toggle-sidebar'])

// ریفرنس به مودال
const userProfileModalRef = ref(null)

// وقتی کاربر روی آواتار کلیک کرد
function openProfile() {
  userProfileModalRef.value?.open()
}

</script>

<template>
  <header
      class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
  >
    <Profile ref="userProfileModalRef" />
    <div class="flex items-center justify-between px-5 py-4">

      <!-- دکمه منوی موبایل (فقط موبایل) -->
      <button
          @click="$emit('toggle-sidebar')"
          class="md:hidden text-primary-600 text-2xl hover:scale-110 transition-transform duration-200"
          aria-label="باز کردن منو"
      >
        <i class="pi pi-bars"></i>
      </button>

      <!-- عنوان صفحه اصلی (در موبایل وسط، در دسکتاپ چپ) -->
      <div class="flex-1 flex justify-center md:justify-start md:flex-initial">
        <div class="text-center md:text-start">
          <h1 class="text-2xl md:text-3xl font-bold text-primary-600 tracking-tight">
            ایستگاه کنترل
          </h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 hidden sm:block">
            ماموریت‌های شما در حال اجراست...
          </p>
        </div>
      </div>

      <!-- بخش کاربر (آواتار + نام) -->
      <div @click="openProfile" class="flex items-center gap-4">
        <!-- آواتار -->
        <div
            class="avatar relative w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center ring-4 ring-primary-200 dark:ring-primary-800/50 transition-all hover:ring-primary-300"
        >
          <i class="pi pi-user-astronaut text-primary-600 dark:text-primary-400 text-2xl"></i>
          <span class="absolute bottom-0 end-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
        </div>

        <!-- نام کاربر (فقط از sm به بالا) -->
        <div class="hidden sm:block text-end">
          <p class="text-xs text-slate-500 dark:text-slate-400">سلام، فرمانده</p>
          <p class="font-semibold text-slate-800 dark:text-white">{{ user.fullName }}</p>
        </div>
      </div>
    </div>
  </header>
</template>