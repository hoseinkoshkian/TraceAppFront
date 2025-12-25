<!-- src/components/modal/BaseModal.vue -->
<template>
  <Transition name="modal-backdrop">
    <div
        v-if="show"
        class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 px-4"
        @click.self="$emit('close')"
    >
      <Transition name="modal-content">
        <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300"
            @click.stop
        >
          <!-- دکمه بستن (اختیاری — می‌توانید در کامپوننت والد هم بگذارید) -->
          <button
              v-if="showCloseButton"
              @click="$emit('close')"
              class="absolute top-4 left-4 text-gray-400 hover:text-gray-600 text-2xl font-light transition"
              aria-label="بستن"
          >
            ×
          </button>

          <slot />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* انیمیشن backdrop */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

/* انیمیشن محتوای مودال */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-content-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>