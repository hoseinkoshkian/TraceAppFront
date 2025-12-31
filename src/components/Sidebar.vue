<script setup>
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'

const props = defineProps({
  isOpen: Boolean,       // باز بودن سایدبار (موبایل)
  isCollapsed: Boolean,  // حالت جمع شده روی دسکتاپ
  isDesktop: Boolean     // دسکتاپ یا موبایل
})

const emit = defineEmits(['toggle-collapse'])

// آیتم‌های منو
const menuItems = [
  { name: 'خانه', icon: 'pi pi-home', to: '/dashboard' },
  { name: 'تقویم', icon: 'pi pi-calendar', to: '/calendar' },
  {
    name: 'اهداف',
    icon: 'pi pi-bullseye',
    children: [
      { name: 'لیست اهداف', icon: 'pi pi-list', to: '/dashboard/goal' },
      { name: 'تسک پترن ها', icon: 'pi pi-list', to: '/dashboard/task-pattern' },
      { name: 'ایجاد هدف جدید', icon: 'pi pi-plus', to: '/dashboard/goal/create' },
    ]
  },
  { name: 'تسک‌ها', icon: 'pi pi-list-check', to: '/tasks' },
  { name: 'پروفایل', icon: 'pi pi-user', to: '/dashboard/profile' },
  { name: 'خروج', icon: 'pi pi-sign-out', to: '/login', logout: true },
]
</script>

<template>
  <aside
      :class="[
      'fixed top-0 h-full z-50 flex flex-col bg-gradient-to-b from-primary-700 via-primary-600 to-primary-900 text-white shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out',
      isDesktop
        ? isCollapsed ? 'w-20' : 'w-72'
        : 'w-72',
      isDesktop ? 'translate-x-0' : (isOpen ? 'translate-x-0' : 'translate-x-full')
    ]"
  >
    <!-- لوگو -->
    <div class="flex flex-col items-center pt-10 pb-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div class="flex items-center gap-4 transition-all duration-500" :class="{ 'gap-0': isCollapsed }">
        <i class="pi pi-satellite-dish text-4xl"></i>
        <transition name="fade-slide">
          <div v-if="!isCollapsed || !isDesktop" class="text-center">
            <h2 class="text-2xl font-bold">هدف‌من</h2>
            <p class="text-sm opacity-90">ایستگاه کنترل اهداف</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- دکمه جمع/باز کردن (فقط دسکتاپ) -->
    <button
        v-if="isDesktop"
        @click="$emit('toggle-collapse')"
        class="absolute top-8 start-6 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-lg"
        :class="{ 'start-auto end-6': isCollapsed }"
    >
      <i class="pi text-lg transition-transform duration-300" :class="isCollapsed ? 'pi-arrow-left' : 'pi-arrow-right'"></i>
    </button>

    <!-- منوها -->
    <nav class="flex-1 px-4 overflow-y-auto mt-8">
      <ul class="space-y-2">
        <MenuItem
            v-for="item in menuItems"
            :key="item.to || item.name"
            :item="item"
            :is-collapsed="isCollapsed && isDesktop"
        />
      </ul>
    </nav>

    <!-- فوتر -->
    <div class="p-4 border-t border-white/20 text-center text-xs opacity-80">
      <transition name="fade">
        <span v-if="!isCollapsed || !isDesktop">
          نسخه ۱.۰ | <span class="text-green-400 font-bold">آنلاین</span>
        </span>
      </transition>
    </div>
  </aside>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
