<template>
  <div class="pattern-list-page">
    <!-- جدول پترن‌ها -->
    <Table
        :data="patternsData"
        :columns="tableColumns"
        title="لیست تسک پترن‌ها"
        :actions="['edit','delete']"
        @edit="openEditModal"
        @delete="openDeleteModal"
    />

    <!-- مودال افزودن/ویرایش پترن -->
    <Dialog
        v-model:visible="showEditModal"
        header="افزودن / ویرایش پترن"
        :modal="true"
        :closable="true"
        :style="{ width: '40vw' }"
    >
      <form @submit.prevent="submitPatternForm" class="pattern-form">
        <div class="field">
          <label>نام پترن <span class="required">*</span></label>
          <InputText v-model="form.name" class="input-field" placeholder="مثال: مطالعه روزانه" />
        </div>

        <div class="field">
          <label>نوع پترن</label>
          <Dropdown
              v-model="form.pattern_type"
              :options="patternTypes"
              optionLabel="label"
              optionValue="value"
              placeholder="انتخاب نوع"
          />
        </div>

        <div class="field">
          <label>توضیحات</label>
          <Textarea v-model="form.description" rows="4" placeholder="توضیحات اختیاری..." />
        </div>

        <div class="form-actions">
          <Button type="button" label="انصراف" @click="showEditModal=false" class="p-button-secondary" />
          <Button type="submit" label="ذخیره" class="p-button-success" />
        </div>
      </form>
    </Dialog>

    <!-- مودال حذف -->
    <ConfirmDelete
        v-model:visible="showDeleteModal"
        :item-name="selectedPatternForDelete?.name || ''"
        @confirm="deletePattern"
        @cancel="showDeleteModal=false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Table from '@/components/table/Table.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import ConfirmDelete from "@/components/ConfirmDelete.vue"
import { useToast } from '@/composables/useToast.js'

const { showSuccess } = useToast()

// داده‌های شبیه‌سازی شده
const patternsData = ref([
  { id: 1, name: 'مطالعه روزانه', pattern_type: 'daily', description: 'هر روز یک تسک ایجاد می‌شود' },
  { id: 2, name: 'تمرین هفتگی', pattern_type: 'weekly', description: 'هر هفته یک تسک ایجاد می‌شود' },
  { id: 3, name: 'مرور سفارشی', pattern_type: 'custom', description: 'بر اساس تنظیمات دلخواه' },
])

// ستون‌های جدول
const tableColumns = [
  { field: 'name', header: 'نام پترن' },
  { field: 'pattern_type', header: 'نوع' },
  { field: 'description', header: 'توضیحات' },
]

// فرم
const form = ref({ name: '', pattern_type: 'daily', description: '' })
const patternTypes = [
  { label: 'روزانه', value: 'daily' },
  { label: 'هفتگی', value: 'weekly' },
  { label: 'سفارشی', value: 'custom' },
]

const showEditModal = ref(false)
const selectedPattern = ref(null)

// باز کردن مودال برای ویرایش یا افزودن
const openEditModal = (pattern) => {
  if (pattern) {
    selectedPattern.value = pattern
    form.value = { ...pattern }
  } else {
    selectedPattern.value = null
    form.value = { name: '', pattern_type: 'daily', description: '' }
  }
  showEditModal.value = true
}

// ذخیره فرم
const submitPatternForm = () => {
  if (selectedPattern.value) {
    Object.assign(selectedPattern.value, form.value)
    showSuccess('پترن ویرایش شد!')
  } else {
    const newPattern = { id: Date.now(), ...form.value }
    patternsData.value.push(newPattern)
    showSuccess('پترن جدید اضافه شد!')
  }
  showEditModal.value = false
}

// حذف
const showDeleteModal = ref(false)
const selectedPatternForDelete = ref(null)
const openDeleteModal = (pattern) => {
  selectedPatternForDelete.value = pattern
  showDeleteModal.value = true
}
const deletePattern = () => {
  patternsData.value = patternsData.value.filter(p => p.id !== selectedPatternForDelete.value.id)
  showDeleteModal.value = false
  showSuccess('پترن حذف شد!')
}
</script>

<style scoped>
.pattern-list-page {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.input-field {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
}

.required {
  color: #ef4444;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
