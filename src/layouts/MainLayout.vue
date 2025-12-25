<!-- src/layouts/MainLayout.vue -->
<script setup>
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import { ref, onMounted, onUnmounted } from 'vue'

// حالت باز/بسته drawer موبایل
const isSidebarOpen = ref(false)

// آیا دسکتاپ/تبلت هستیم؟
const isDesktop = ref(false)

// حالت جمع‌شده سایدبار روی دسکتاپ (collapsed)
const isCollapsed = ref(false)

const toggleSidebar = () => {
  if (!isDesktop.value) {
    isSidebarOpen.value = !isSidebarOpen.value
  }
}

// تابع toggle برای collapsed (روی دسکتاپ)
const toggleCollapse = () => {
  if (isDesktop.value) {
    isCollapsed.value = !isCollapsed.value
  }
}

const updateScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768
  if (isDesktop.value) {
    isSidebarOpen.value = true  // روی دسکتاپ همیشه "باز" به معنای visible
    // می‌تونی اینجا isCollapsed.value = false بذاری اگر می‌خوای همیشه باز شروع بشه
  }
}

onMounted(() => {
  const btn = document.getElementById('menu-toggle')
  if (btn) btn.addEventListener('click', toggleSidebar)

  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
    <!-- Overlay موبایل -->
    <div
        v-if="isSidebarOpen && !isDesktop"
        @click="isSidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm"
        :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>

    <!-- سایدبار با پشتیبانی از collapsed -->
    <Sidebar
        :is-open="isSidebarOpen && !isDesktop || isDesktop"
        :is-collapsed="isCollapsed && isDesktop"
        :is-desktop="isDesktop"
        @toggle-collapse="toggleCollapse"
        class="fixed md:static inset-y-0 right-0 z-50
             transform transition-all duration-500 ease-in-out
             md:translate-x-0"
        :class="{
        'translate-x-0': isSidebarOpen && !isDesktop || isDesktop,
        'translate-x-full': !isSidebarOpen && !isDesktop,
        'w-72': !isCollapsed || !isDesktop,
        'w-20': isCollapsed && isDesktop
      }"
    />

    <!-- محتوای اصلی -->
    <div class="flex-1 flex flex-col transition-all duration-500">
      <Header @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-slate-950">
        <slot />
      </main>
    </div>
  </div>
</template>