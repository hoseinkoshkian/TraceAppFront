<template>
  <form @submit.prevent="submitForm" class="goal-form">
    <!-- Grid اصلی فرم -->
    <div class="form-grid">

      <!-- عنوان هدف -->
      <div class="field">
        <label class="field-label">
          عنوان هدف <span class="required">*</span>
        </label>
        <InputText
            v-model="form.title"
            :class="['input-field', { 'input-error': v$.title.$error }]"
            placeholder="مثال: یادگیری Vue 3 به طور کامل"
            dir="rtl"
        />
        <small v-if="v$.title.$error" class="error-message">
          {{ v$.title.$errors[0].$message }}
        </small>
      </div>

      <!-- تاریخ شروع -->
      <div class="field">
        <label class="field-label">
          تاریخ شروع <span class="required">*</span>
        </label>
        <DatePicker
            v-model="jalaliDate"
            format="jYYYY/jMM/jDD"
            display-format="jYYYY/jMM/jDD"
            :class="['input-field', { 'input-error': v$.jalaliDate.$error }]"
        />
        <small v-if="v$.jalaliDate.$error" class="error-message">
          تاریخ شروع الزامی است
        </small>
      </div>
      <div class="field">
        <label class="field-label">
          تاریخ پایان (اختیاری)
        </label>
        <DatePicker
            v-model="jalaliEndDate"
            format="jYYYY/jMM/jDD"
            display-format="jYYYY/jMM/jDD"
            :class="['input-field']"
            placeholder="اختیاری"
        />
        <small class="hint-text">اگر هدف شما زمان‌دار است، تاریخ پایان را وارد کنید</small>
      </div>
      <!-- هدف والد (اختیاری) -->
      <div class="field col-span-full">
        <label class="field-label">هدف والد (اختیاری)</label>
        <AutoComplete
            v-model="selectedParent"
            :suggestions="parentOptions"
            optionLabel="title"
            placeholder="جستجو بین اهداف..."
            class="input-field"
            :forceSelection="true"
            @complete="searchParents"
        />
      </div>

      <!-- توضیحات -->
      <div class="field col-span-full">
        <label class="field-label">توضیحات</label>
        <Textarea
            v-model="form.description"
            rows="5"
            placeholder="توضیحات بیشتر درباره هدف خود بنویسید..."
            class="input-field"
            dir="rtl"
        />
      </div>

    </div>

    <!-- دکمه‌های فرم -->
    <div class="form-actions">
      <Button
          type="button"
          label="انصراف"
          icon="pi pi-times"
          class="p-button-secondary p-button-outlined"
          @click="emit('cancel')"
          :disabled="isSubmitting"
      />
      <Button
          type="submit"
          :label="isEditMode ? 'ذخیره تغییرات' : 'افزودن هدف'"
          icon="pi pi-check"
          class="p-button-success"
          :loading="isSubmitting"
      />
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import moment from 'moment-jalaali'

import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete'
import DatePicker from 'vue3-persian-datetime-picker'
import {useToast} from "@/composables/useToast.js";

const { showSuccess, showError } = useToast()

import { useCreateGoal, useUpdateGoal, useGoals, useGoalDetail } from '@/composables/useGoal.js'

// Props & Emits
const props = defineProps({
  initialData: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['success', 'cancel'])

// State فرم
const form = ref({ title: '', description: '' })
const jalaliDate = ref(null)
const jalaliEndDate = ref(null)
const selectedParent = ref(null)

// حالت ویرایش و وضعیت ارسال
const createMutation = useCreateGoal()
const updateMutation = useUpdateGoal()
const isEditMode = computed(() => !!props.initialData?.id)
const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

// قوانین اعتبارسنجی
const rules = {
  title: {
    required: helpers.withMessage('عنوان هدف الزامی است', required),
    minLength: helpers.withMessage('عنوان باید حداقل ۳ کاراکتر باشد', minLength(3))
  },
  jalaliDate: {
    required: helpers.withMessage('تاریخ شروع الزامی است', required)
  }
}
const state = computed(() => ({ title: form.value.title, jalaliDate: jalaliDate.value }))
const v$ = useVuelidate(rules, state)

// Autocomplete اهداف والد
const parentSearch = ref('')
const { data: goalsData } = useGoals(parentSearch)
const parentOptions = ref([])
watch(goalsData, val => parentOptions.value = val || [])

const searchParents = (event) => {
  parentSearch.value = event.query || ''
}

// بارگذاری داده اولیه در حالت ویرایش
watch(() => props.initialData, val => {
  if (val?.id) {
    form.value.title = val.title || ''
    form.value.description = val.description || ''
    jalaliDate.value = val.dateForTable
    jalaliEndDate.value = val.endDateForTable || null
    selectedParent.value = val.parent ? { id: val.parent, title: val.parent_title || 'هدف والد' } : null

    if (val.parent){
      const { data } = useGoalDetail(ref(val.parent))
      watch(data, (parentData) => {
        if (parentData) {
          selectedParent.value = { id: parentData.id, title: parentData.title }
          parentOptions.value = [selectedParent.value]
        }
      }, { immediate: true })
    }
  } else {
    form.value.title = ''
    form.value.description = ''
    jalaliDate.value = null
    selectedParent.value = null
    parentOptions.value = []
    v$.value.$reset()
  }
}, { immediate: true })

// آماده‌سازی داده برای ارسال
const preparePayload = () => {
  const payload = { title: form.value.title.trim() }
  if (form.value.description?.trim()) payload.description = form.value.description.trim()
  if (jalaliDate.value) {
    const m = moment(jalaliDate.value, 'jYYYY/jMM/jDD')
    payload.start_datetime = m.utc().format()
  }
  if (jalaliEndDate.value) {
    const mEnd = moment(jalaliEndDate.value, 'jYYYY/jMM/jDD')
    payload.end_datetime = mEnd.utc().format()
  } else {

    payload.end_datetime = null
  }
  if (selectedParent.value) payload.parent = selectedParent.value.id
  return payload
}

// ارسال فرم
const submitForm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    if (isEditMode.value) {
      await updateMutation.mutateAsync({ id: props.initialData.id, updates: preparePayload() })
      showSuccess('هدف با موفقیت ویرایش شد!')
    } else {
      await createMutation.mutateAsync(preparePayload())
      showSuccess('هدف با موفقیت ایجاد شد!')
    }
    emit('success')
  } catch (error) {
    console.error('خطا در ذخیره هدف:', error)
    showError('خطایی رخ داد. لطفاً دوباره تلاش کنید.')
  }
}
</script>

<style scoped>
/* ---------- فرم اصلی ---------- */
.goal-form {
  direction: rtl;
  font-family: 'Vazir', sans-serif;
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.8rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* ---------- شبکه فرم ---------- */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ---------- ستون کامل ---------- */
.col-span-full {
  grid-column: 1 / -1;
}

/* ---------- فیلدهای فرم ---------- */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #374151;
}

.required {
  color: #ef4444;
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
  outline: none;
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* ---------- دکمه‌ها ---------- */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}
.hint-text {
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

</style>
