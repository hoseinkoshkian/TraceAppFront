<template>
  <BaseModal :show="show" @close="emit('close')">
    <h2 class="text-lg font-bold mb-4">افزودن تسک</h2>

    <input
        v-model="localTask.title"
        placeholder="عنوان"
        class="input"
    />

    <input
        type="time"
        v-model="localTask.time"
        class="input mt-2"
    />

    <div class="flex justify-end gap-2 mt-4">
      <button @click="emit('close')">لغو</button>
      <button class="btn-primary" @click="submit">ثبت</button>
    </div>
  </BaseModal>
</template>

<script setup>
import { reactive, watch } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  show: Boolean,
  task: Object
})

const emit = defineEmits(['close', 'submit'])

const localTask = reactive({
  title: '',
  time: ''
})

watch(() => props.task, (t) => {
  if (t) Object.assign(localTask, t)
})

const submit = () => {
  emit('submit', { ...localTask })
}
</script>
