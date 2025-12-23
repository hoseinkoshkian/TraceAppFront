<!-- src/components/Sidebar.vue -->
<script setup>
import { useRoute, RouterLink } from 'vue-router'
const route = useRoute()

const menuItems = [
  { name: 'خانه', icon: 'fa-home', to: '/dashboard' },
  { name: 'تقویم', icon: 'fa-calendar-alt', to: '/calendar' },
  { name: 'اهداف', icon: 'fa-crosshairs', to: '/goals' },
  { name: 'تسک‌ها', icon: 'fa-tasks', to: '/tasks' },
  { name: 'پروفایل', icon: 'fa-user-astronaut', to: '/profile' },
  { name: 'خروج', icon: 'fa-sign-out-alt', to: '/login', logout: true },
]
</script>

<!-- src/components/Sidebar.vue — نسخه درست و نهایی -->
<template>
  <aside class="h-full bg-gradient-to-b from-primary-600 to-primary-800 text-white flex flex-col shadow-2xl">
    <!-- لوگو و منوها مثل قبل -->
    <div class="relative flex flex-col items-center pt-10 pb-6">
      <div class="absolute inset-0 bg-white/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <h2 class="text-3xl font-bold flex items-center gap-3">
        <i class="fas fa-satellite-dish"></i> هدف‌من
      </h2>
      <p class="text-sm opacity-90 mt-2">ایستگاه کنترل اهداف</p>
    </div>

    <nav class="flex-1 px-6">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.to">
          <router-link
              :to="item.to"
              class="flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-white/10"
              :class="{ 'bg-white/20 shadow-lg': $route.path === item.to, 'text-red-300 hover:bg-red-900/30': item.logout }"
          >
            <i :class="['fas', item.icon, 'w-6']"></i>
            <span class="font-medium">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="p-6 border-t border-white/20 text-center text-sm">
      نسخه 1.0 | <span class="text-green-400 font-bold">آنلاین</span>
    </div>
  </aside>
</template>