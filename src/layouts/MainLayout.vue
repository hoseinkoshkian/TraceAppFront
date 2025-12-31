<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">

    <!-- Overlay موبایل -->
    <transition name="fade">
      <div
          v-if="isSidebarOpen && !isDesktop"
          @click="closeSidebar"
          class="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
      ></div>
    </transition>

    <!-- Sidebar -->
    <Sidebar
        :is-open="isSidebarOpen"
        :is-collapsed="isCollapsed && isDesktop"
        :is-desktop="isDesktop"
        @toggle-collapse="toggleCollapse"
        class="fixed top-0 right-0 h-full z-50 transform transition-transform duration-300 ease-in-out"
        :class="{
        'translate-x-0': isSidebarOpen || isDesktop,
        'translate-x-full': !isSidebarOpen && !isDesktop
      }"
    />

    <!-- محتوای اصلی -->
    <div
        :class="[
        'flex-1 flex flex-col transition-all duration-500 ml-18',
        isDesktop ? (isCollapsed ? 'mr-20' : 'mr-72') : ''
      ]"
    >
      <Header @toggle-sidebar="toggleSidebar" />

      <main class="flex-1   overflow-auto p-2 sm:p-4 md:p-6 bg-gray-50 dark:bg-slate-950">
        <router-view />
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

// وضعیت سایدبار
const isSidebarOpen = ref(false)
const isDesktop = ref(window.innerWidth >= 768)
const isCollapsed = ref(false)

// باز/بسته کردن سایدبار موبایل
const toggleSidebar = () => {
  if (!isDesktop.value) isSidebarOpen.value = !isSidebarOpen.value
}
const closeSidebar = () => {
  if (!isDesktop.value) isSidebarOpen.value = false
}

// جمع/باز کردن سایدبار دسکتاپ
const toggleCollapse = () => {
  if (isDesktop.value) isCollapsed.value = !isCollapsed.value
}

// بروزرسانی وضعیت دسکتاپ و سایدبار
const updateScreenSize = () => {
  isDesktop.value = window.innerWidth >= 768
  if (isDesktop.value) {
    isSidebarOpen.value = true  // همیشه باز روی دسکتاپ
  } else {
    isSidebarOpen.value = false // پیش‌فرض بسته روی موبایل
  }
}

// جلوگیری از scroll محتوا پشت drawer موبایل
watch([isSidebarOpen, isDesktop], () => {
  if (!isDesktop.value && isSidebarOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
  document.body.style.overflow = ''
})
</script>

<style>
/* Overlay fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
