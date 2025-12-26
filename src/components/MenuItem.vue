<!-- src/components/MenuItem.vue -->
<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = defineProps({
  item: { type: Object, required: true },
  isCollapsed: { type: Boolean, default: false },
  level: { type: Number, default: 0 } // برای indent در سطوح عمیق‌تر
})

const route = useRoute()
const isOpen = ref(false) // برای باز/بسته کردن زیرمنو

const hasChildren = computed(() => props.item.children && props.item.children.length > 0)

const isActive = computed(() => {
  if (props.item.to && route.path === props.item.to) return true
  if (hasChildren.value) {
    return props.item.children.some(child => child.to && route.path.startsWith(child.to))
  }
  return false
})

const toggleOpen = () => {
  if (hasChildren.value) isOpen.value = !isOpen.value
}

const indentClass = computed(() => `pl-${props.level * 6}`)
</script>

<template>
  <li>
    <router-link
        v-if="!hasChildren && item.to"
        :to="item.to"
        class="group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg relative overflow-hidden"
        :class="{
        'bg-white/25 shadow-xl': isActive,
        'justify-center px-3': isCollapsed,
        'text-red-300 hover:bg-red-900/40': item.logout,
        [indentClass]: level > 0
      }"
        @click="item.logout && $emit('logout')"
    >
      <i :class="['text-xl', item.icon]"></i>
      <transition name="fade-slide">
        <span v-if="!isCollapsed" class="font-medium whitespace-nowrap">{{ item.name }}</span>
      </transition>
    </router-link>

    <!-- آیتم با زیرمنو -->
    <div
        v-else
        @click="toggleOpen"
        class="group flex items-center justify-between gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/20 hover:shadow-lg cursor-pointer relative overflow-hidden"
        :class="{
        'bg-white/25 shadow-xl': isActive,
        'justify-center px-3': isCollapsed,
        [indentClass]: level > 0
      }"
    >
      <div class="flex items-center gap-4">
        <i :class="['text-xl', item.icon]"></i>
        <transition name="fade-slide">
          <span v-if="!isCollapsed" class="font-medium whitespace-nowrap">{{ item.name }}</span>
        </transition>
      </div>
      <i v-if="!isCollapsed" class="pi pi-chevron-left text-sm transition-transform duration-300" :class="{ 'rotate-180': isOpen }"></i>
    </div>

    <!-- زیرمنوها (recursive) -->
    <transition name="slide">
      <ul v-if="hasChildren && isOpen" class="mt-1 space-y-1">
        <MenuItem
            v-for="child in item.children"
            :key="child.to || child.name"
            :item="child"
            :is-collapsed="isCollapsed"
            :level="level + 1"
        />
      </ul>
    </transition>

    <!-- Tooltip در حالت collapsed -->
    <transition name="fade">
      <div
          v-if="isCollapsed && !hasChildren"
          class="absolute top-1/2 -translate-y-1/2 left-full ml-3 px-4 py-2 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-2xl z-50"
      >
        {{ item.name }}
      </div>
    </transition>
  </li>
</template>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 500px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>