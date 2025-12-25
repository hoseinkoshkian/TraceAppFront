<!-- src/components/modal/AddTaskModal.vue -->
<template>
  <BaseModal :show="show" @close="handleClose">
    <div class="p-8 pt-12"> <!-- pt-12 برای جبران دکمه × -->
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">
        افزودن برنامه جدید
      </h2>

      <form @submit.prevent="submit" class="space-y-6">
        <div>
          <input
              v-model="localTask.title"
              placeholder="عنوان برنامه"
              required
              class="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <input
              type="time"
              v-model="localTask.time"
              class="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition"
          />
        </div>

        <div class="flex justify-between gap-4 pt-4">
          <button
              type="button"
              @click="handleClose"
              class="flex-1 py-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
          >
            لغو
          </button>
          <button
              type="submit"
              class="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
          >
            ثبت برنامه
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: Boolean,
  task: {
    type: Object,
    default: () => ({ title: '', time: '', date: '' })
  }
})

const emit = defineEmits(['submit', 'close'])

const localTask = reactive({ ...props.task })

watch(() => props.task, (newVal) => {
  Object.assign(localTask, newVal)
}, { deep: true })

const submit = () => {
  if (!localTask.title.trim()) return
  emit('submit', { ...localTask })
}

const handleClose = () => {
  emit('close')
  // اختیاری: ریست فرم
  localTask.title = ''
  localTask.time = ''
}
</script>