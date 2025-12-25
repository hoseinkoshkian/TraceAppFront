<!-- src/components/layout/Sidebar.vue -->
<template>
  <aside class="hidden lg:flex fixed inset-y-0 right-0 w-20 bg-white shadow-2xl flex-col items-center py-10 space-y-10 z-50 border-l border-gray-100">
    <div class="flex-1 flex flex-col items-center space-y-8 pt-8">
      <!-- داشبورد -->
      <router-link to="/dashboard" class="group relative p-4 rounded-2xl hover:bg-gray-100 transition-all">
        <svg class="w-7 h-7 text-gray-600 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          داشبورد
        </span>
      </router-link>

      <!-- اهداف -->
      <button class="group relative p-4 rounded-2xl hover:bg-gray-100 transition-all">
        <svg class="w-7 h-7 text-gray-600 group-hover:text-green-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          اهداف
        </span>
      </button>

      <!-- تسک‌ها — صفحه فعلی (هایلایت شده) -->
      <button class="group relative p-4 rounded-2xl bg-blue-100 shadow-md">
        <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          تسک‌ها
        </span>
      </button>

      <!-- چالش‌ها -->
      <button class="group relative p-4 rounded-2xl hover:bg-gray-100 transition-all">
        <svg class="w-7 h-7 text-gray-600 group-hover:text-purple-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          چالش‌ها
        </span>
      </button>

      <!-- مالی -->
      <button class="group relative p-4 rounded-2xl hover:bg-gray-100 transition-all">
        <svg class="w-7 h-7 text-gray-600 group-hover:text-yellow-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          مالی
        </span>
      </button>

      <!-- پشتیبانی -->
      <button class="group relative p-4 rounded-2xl hover:bg-gray-100 transition-all">
        <svg class="w-7 h-7 text-gray-600 group-hover:text-red-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          پشتیبانی
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
// این کامپوننت فعلاً هیچ props یا emit نداره
// بعداً می‌تونی prop برای activeItem اضافه کنی تا هایلایت دینامیک بشه
</script>

<style scoped>
/* نیازی به استایل اضافی نیست، همه چیز با Tailwind هست */
</style>