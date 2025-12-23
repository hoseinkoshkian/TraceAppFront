<!-- src/layouts/MainLayout.vue -->
<script setup>
import Sidebar from "@/components/Sidebar.vue"
import Header from "@/components/Header.vue"
import ThemeToggle from "@/components/ThemeToggle.vue"
import { ref, onMounted } from 'vue'

// refs
const sidebar = ref(null)
const overlay = ref(null)
const menuBtn = ref(null)

const toggleSidebar = () => {
  sidebar.value?.classList.toggle('-translate-x-full')
  overlay.value?.classList.toggle('hidden')
}

onMounted(() => {
  // اگر از Header بیایم، دکمه رو اینجا هم گوش بده
  const btn = document.getElementById('menu-toggle')
  if (btn) btn.addEventListener('click', toggleSidebar)
})
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-slate-900">
    <!-- سایدبار اصلی (فقط یکی!) -->
    <Sidebar
        ref="sidebar"
        class="fixed inset-y-0 right-0 z-50 w-72 transform transition-transform duration-300 lg:translate-x-0 -translate-x-full lg:static lg:inset-auto"
    />

    <!-- اورلی موبایل -->
    <div
        ref="overlay"
        @click="toggleSidebar"
        id="mobile-overlay"
        class="fixed inset-0 bg-black/50 z-40 hidden lg:hidden"
    ></div>

    <!-- محتوای اصلی -->
    <div class="flex-1 flex flex-col">
      <Header :menuBtn="menuBtn" @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <slot />
      </main>
    </div>

    <!-- دکمه تغییر تم -->
<!--    <ThemeToggle />-->
  </div>
</template>