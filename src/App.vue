<!-- src/App.vue -->
<script setup>
import { computed, ref, provide } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import Toast from 'primevue/toast'

const route = useRoute()

const toast = ref(null)
provide('toast', toast)

const layout = computed(() => route.meta.layout === 'blank' ? BlankLayout : MainLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
    <Toast ref="toast" />
  </component>
</template>