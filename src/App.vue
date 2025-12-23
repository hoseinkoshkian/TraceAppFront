<!-- src/App.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()

// اگر meta.layout === 'blank' بود → BlankLayout
// در غیر این صورت → MainLayout
const layout = computed(() => {
  return route.meta.layout === 'blank' ? BlankLayout : MainLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>