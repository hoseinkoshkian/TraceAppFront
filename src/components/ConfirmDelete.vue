<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const props = defineProps({
  visible: { type: Boolean, default: false },
  itemName: { type: String, default: '' }
})

const emit = defineEmits(['update:visible', 'confirm', 'cancel'])

const isVisible = ref(props.visible)

watch(() => props.visible, val => isVisible.value = val)
watch(isVisible, val => emit('update:visible', val))

const handleConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const handleCancel = () => {
  emit('cancel')
  isVisible.value = false
}
</script>

<template>
  <Dialog
      v-model:visible="isVisible"
      :modal="true"
      header=""
      :closable="false"
      :style="{ width: '35vw', borderRadius: '0.8rem', padding: '1.5rem' }"
      class="confirm-delete-dialog"
  >
    <div class="delete-icon">
      <i class="pi pi-exclamation-triangle"></i>
    </div>
    <h2 class="delete-title">حذف هدف</h2>
    <p class="delete-message">
      آیا مطمئن هستید که می‌خواهید هدف <strong>{{ itemName }}</strong> را حذف کنید؟
      این عملیات قابل بازگشت نیست.
    </p>
    <div class="flex justify-end gap-3 mt-5">
      <Button
          label="انصراف"
          icon="pi pi-times"
          class="p-button-outlined p-button-secondary"
          @click="handleCancel"
      />
      <Button
          label="حذف"
          icon="pi pi-trash"
          class="p-button-danger"
          @click="handleConfirm"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.confirm-delete-dialog .delete-icon {
  font-size: 3rem;
  color: #f87171; /* قرمز جذاب */
  text-align: center;
  margin-bottom: 1rem;
  animation: pulse 1s infinite;
}

.confirm-delete-dialog .delete-title {
  text-align: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.confirm-delete-dialog .delete-message {
  text-align: center;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
