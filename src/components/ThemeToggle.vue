<!-- src/components/ThemeToggle.vue -->
<script setup>
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark')
  const isDark = document.documentElement.classList.contains('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

// اعمال تم در لود
if (
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark')
}
</script>

<template>
  <button
      @click="toggleTheme"
      class="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-primary-600 dark:bg-yellow-400 text-white dark:text-slate-900 shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 hover:shadow-glow-lg hover:rotate-12"
      aria-label="تغییر تم"
  >
    <i class="fas fa-moon" v-if="!document.documentElement.classList.contains('dark')"></i>
    <i class="fas fa-sun" v-else></i>
  </button>
</template>