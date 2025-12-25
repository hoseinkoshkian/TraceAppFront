<!-- src/components/Sidebar.vue -->
<script setup>
import { useRoute, RouterLink } from 'vue-router'
import { defineProps, defineEmits } from 'vue'

const route = useRoute()

const props = defineProps({
  isOpen: Boolean,
  isCollapsed: Boolean,
  isDesktop: Boolean
})

const emit = defineEmits(['toggle-collapse'])

// منو با آیکون SVG جدا برای حالت collapsed
const menuItems = [
  { name: 'خانه', icon: 'fa-home', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 10h3v8h4v-5h2v5h4v-8h3L10 2z"/></svg>`, to: '/dashboard' },
  { name: 'تقویم', icon: 'fa-calendar-alt', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7h18v14H3V7zm0-2a2 2 0 012-2h2V1h2v2h4V1h2v2h2a2 2 0 012 2v2H3V5z"/></svg>`, to: '/calendar' },
  { name: 'اهداف', icon: 'fa-crosshairs', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m16.95 5.05l-1.414-1.414M6.464 6.464L5.05 5.05m0 13.9l1.414-1.414M17.486 6.464l1.414-1.414"/></svg>`, to: '/goals' },
  { name: 'تسک‌ها', icon: 'fa-tasks', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h12v2H3v-2z"/></svg>`, to: '/tasks' },
  { name: 'پروفایل', icon: 'fa-user-astronaut', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`, to: '/profile' },
  { name: 'خروج', icon: 'fa-sign-out-alt', svg: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 17l5-5-5-5v3H9v4h7v3zM5 5h6v2H7v10h4v2H5V5z"/></svg>`, to: '/login', logout: true },
]
</script>

<template>
  <aside
      class="h-full bg-gradient-to-b from-primary-700 via-primary-600 to-primary-900 text-white flex flex-col shadow-2xl overflow-hidden"
      :class="{ 'items-center': isCollapsed }"
  >

    <!-- هدر لوگو -->
    <div class="relative flex flex-col items-center pt-10 pb-6 overflow-hidden">
      <div class="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div class="flex items-center gap-4 transition-all duration-500" :class="{ 'gap-0': isCollapsed }">
        <i class="fas fa-satellite-dish text-4xl"></i>
        <transition name="fade-slide">
          <div v-if="!isCollapsed" class="text-center">
            <h2 class="text-2xl font-bold">هدف‌من</h2>
            <p class="text-sm opacity-90">ایستگاه کنترل اهداف</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- دکمه جمع/باز کردن منو بالای لیست منوها -->
    <div v-if="isDesktop" class="px-4 mb-4 flex justify-center">
      <button
          @click="emit('toggle-collapse')"
          class="flex flex-col justify-between w-6 h-6 py-1"
      >
    <span class="block h-0.5 bg-white rounded transition-transform duration-300"
          :class="{ 'rotate-45 translate-y-2': isCollapsed }"></span>
        <span class="block h-0.5 bg-white rounded transition-opacity duration-300"
              :class="{ 'opacity-0': isCollapsed }"></span>
        <span class="block h-0.5 bg-white rounded transition-transform duration-300"
              :class="{ '-rotate-45 -translate-y-2': isCollapsed }"></span>
      </button>
    </div>

    <!-- منوها -->
    <nav class="flex-1 px-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
              :to="item.to"
              class="group flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300
                   hover:bg-white/20 hover:shadow-lg hover:scale-105 relative overflow-hidden"
              :class="{
            'bg-white/25 shadow-xl': $route.path === item.to,
            'text-red-300 hover:bg-red-900/40': item.logout,
            'justify-center': isCollapsed,
            'px-3': isCollapsed
          }"
          >
            <!-- آیکون SVG وقتی collapsed -->
            <span v-if="isCollapsed" v-html="item.svg"></span>

            <!-- آیکون فونت وقتی باز -->
            <i v-else :class="['fas', item.icon, 'text-xl', { 'w-6': !isCollapsed }]"></i>

            <!-- متن با انیمیشن -->
            <transition name="fade-slide">
              <span v-if="!isCollapsed" class="font-medium whitespace-nowrap">{{ item.name }}</span>
            </transition>

            <!-- Tooltip وقتی collapsed -->
            <transition name="fade">
              <div
                  v-if="isCollapsed"
                  class="absolute left-full ml-3 px-4 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl z-50"
              >
                {{ item.name }}
              </div>
            </transition>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- فوتر -->
    <div class="p-4 border-t border-white/20 text-center text-xs opacity-80">
      <transition name="fade">
      <span v-if="!isCollapsed">
        نسخه ۱.۰ | <span class="text-green-400 font-bold">آنلاین</span>
      </span>
      </transition>
    </div>
  </aside>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
