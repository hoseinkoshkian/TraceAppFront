<template>
  <BaseModal :show="show" @close="$emit('close')">

    <h3 class="text-xl font-bold mb-4 text-center">
      افزودن برنامه جدید
    </h3>

    <form @submit.prevent="submit">
      <input
          v-model="title"
          placeholder="عنوان برنامه"
          class="w-full border rounded-lg px-4 py-3 mb-4"
      />

      <input
          v-model="time"
          type="time"
          class="w-full border rounded-lg px-4 py-3 mb-6"
      />

      <div class="flex gap-3">
        <button
            type="submit"
            class="flex-1 bg-blue-600 text-white py-3 rounded-lg"
        >
          ثبت
        </button>

        <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-200 py-3 rounded-lg"
        >
          لغو
        </button>
      </div>
    </form>

  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

defineProps({
  show: Boolean,
  date: String
})

const emit = defineEmits(['close', 'submit'])

const title = ref('')
const time = ref('')

const submit = () => {
  if (!title.value.trim()) return

  emit('submit', {
    title: title.value,
    time: time.value,
  })

  title.value = ''
  time.value = ''
}
</script>
