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
            placeholder="انتخاب تاریخ"
        />
        <small v-if="v$.jalaliDate.$error" class="error-message">
          تاریخ شروع الزامی است
        </small>
      </div>

      <!-- تاریخ پایان -->
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

      <!-- هدف والد -->
      <div class="field col-span-full">
        <label class="field-label">هدف والد (اختیاری)</label>
        <AutoComplete
            v-model="selectedParent"
            :suggestions="parentOptions"
            optionLabel="title"
            placeholder="جستجو بین اهداف موجود..."
            class="input-field"
            :forceSelection="true"
            dropdown
            @complete="searchParents"
        />
        <small class="hint-text">می‌توانید این هدف را زیرمجموعه‌ی یک هدف دیگر قرار دهید</small>
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

    <!-- بخش تسک پترن‌ها - خیلی جذاب و حرفه‌ای -->
    <div class="task-patterns-section">
      <h3 class="section-title">
        <i class="pi pi-list mr-2"></i>
        تسک پترن‌ها
      </h3>
      <p class="section-subtitle">
        الگوهای تکرارشونده برای ایجاد تسک‌های خودکار (مثل مطالعه روزانه یا تمرین هفتگی)
      </p>

      <MultiSelect
          v-model="selectedTaskPatterns"
          :options="allTaskPatterns"
          optionLabel="name"
          optionValue="id"
          placeholder="جستجو و انتخاب تسک پترن‌ها..."
          class="enhanced-multiselect"
          display="chip"
          filter
          filterPlaceholder="جستجو بر اساس نام یا نوع..."
          showClear
          :maxSelectedLabels="5"
          selectedItemsLabel="{0} پترن انتخاب شده"
          emptyFilterMessage="پترنی یافت نشد"
          emptyMessage="هنوز پترنی تعریف نشده"
      >
        <!-- نمایش گزینه‌ها در dropdown -->
        <template #option="{ option }">
          <div class="pattern-option flex items-center justify-between p-3 hover:bg-indigo-50 rounded-lg transition">
            <div class="flex items-center gap-3">
              <div :class="['pattern-icon', `icon-${option.pattern_type}`]">
                <i :class="getPatternIcon(option.pattern_type)"></i>
              </div>
              <div>
                <div class="font-medium text-gray-900">{{ option.name }}</div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ option.description || 'ایجاد تسک به صورت خودکار بر اساس این الگو' }}
                </div>
              </div>
            </div>
            <span :class="['pattern-badge', `badge-${option.pattern_type}`]">
              {{ patternTypeLabel(option.pattern_type) }}
            </span>
          </div>
        </template>

        <!-- نمایش چیپ‌های انتخاب‌شده -->
        <template #chip="{ value }">
          <div class="pattern-chip inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
            <i :class="getPatternIcon(allTaskPatterns.find(p => p.id === value)?.pattern_type || 'daily')"></i>
            <span class="font-medium">{{ allTaskPatterns.find(p => p.id === value)?.name }}</span>
            <span :class="['text-xs px-2 py-0.5 rounded', `badge-${allTaskPatterns.find(p => p.id === value)?.pattern_type}`]">
              {{ patternTypeLabel(allTaskPatterns.find(p => p.id === value)?.pattern_type) }}
            </span>
          </div>
        </template>

        <!-- فوتر -->
        <template #footer>
          <div class="multiselect-footer p-3 text-center text-sm text-gray-600 border-t">
            {{ selectedTaskPatterns.length > 0 ? `${selectedTaskPatterns.length} پترن انتخاب شده` : 'هیچ پترنی انتخاب نشده' }}
          </div>
        </template>
      </MultiSelect>

      <small class="hint-text block mt-3">
        می‌توانید چندین پترن را همزمان انتخاب کنید تا تسک‌های تکرارشونده به صورت خودکار ساخته شوند.
      </small>
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
          class="p-button-success custom-success-btn"
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
import MultiSelect from 'primevue/multiselect'
import { useToast } from "@/composables/useToast.js"

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

// Task Patterns
const allTaskPatterns = ref([
  { id: '1', name: 'مطالعه روزانه', pattern_type: 'daily', description: 'هر روز یک تسک جدید ایجاد می‌شود' },
  { id: '2', name: 'تمرین هفتگی', pattern_type: 'weekly', description: 'هر هفته در روز مشخص تسک ساخته می‌شود' },
  { id: '3', name: 'مرور سفارشی', pattern_type: 'custom', description: 'بر اساس تنظیمات دلخواه تکرار می‌شود' },
  { id: '4', name: 'ورزش صبحگاهی', pattern_type: 'daily', description: 'هر صبح تسک ورزش اضافه می‌شود' },
  { id: '5', name: 'جلسه تیمی ماهانه', pattern_type: 'custom', description: 'اول هر ماه جلسه تنظیم شود' },
])

const selectedTaskPatterns = ref([])

const patternTypeLabel = (type) => {
  switch (type) {
    case 'daily': return 'روزانه'
    case 'weekly': return 'هفتگی'
    case 'custom': return 'سفارشی'
    default: return 'نامشخص'
  }
}

const getPatternIcon = (type) => {
  switch (type) {
    case 'daily': return 'pi pi-sun'
    case 'weekly': return 'pi pi-calendar'
    case 'custom': return 'pi pi-cog'
    default: return 'pi pi-circle'
  }
}

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
    jalaliDate.value = val.dateForTable || null
    jalaliEndDate.value = val.endDateForTable || null
    selectedParent.value = val.parent ? { id: val.parent, title: val.parent_title || 'هدف والد' } : null
    selectedTaskPatterns.value = val.task_patterns || []

    if (val.parent) {
      const { data } = useGoalDetail(ref(val.parent))
      watch(data, (parentData) => {
        if (parentData) {
          selectedParent.value = { id: parentData.id, title: parentData.title }
          parentOptions.value = [selectedParent.value]
        }
      }, { immediate: true })
    }
  } else {
    // حالت ایجاد جدید
    form.value = { title: '', description: '' }
    jalaliDate.value = null
    jalaliEndDate.value = null
    selectedParent.value = null
    selectedTaskPatterns.value = []
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

  payload.task_patterns = selectedTaskPatterns.value.map(p => p.id || p)

  if (selectedParent.value?.id) payload.parent = selectedParent.value.id

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
.goal-form {
  direction: rtl;
  font-family: 'Vazir', sans-serif;
  background: #ffffff;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 800px;
  margin: 0 auto;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.col-span-full {
  grid-column: 1 / -1;
}

.field-label {
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.input-field {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  outline: none;
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15) !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.35rem;
}

.hint-text {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* بخش تسک پترن‌ها */
.task-patterns-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px dashed #e0e7ff;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e1b4b;
  display: flex;
  align-items: center;
}

.section-subtitle {
  color: #6366f1;
  font-size: 0.95rem;
  margin: 0.5rem 0 1.5rem 0;
}

/* MultiSelect سفارشی */
.enhanced-multiselect :deep(.p-multiselect) {
  border-radius: 1rem;
  border: 1px solid #c7d2fe;
  background: #f8faff;
  transition: all 0.3s ease;
}

.enhanced-multiselect :deep(.p-multiselect:hover) {
  border-color: #6366f1;
  background: #ffffff;
}

.enhanced-multiselect :deep(.p-multiselect-panel) {
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
  border: none;
  margin-top: 0.5rem;
}

.pattern-option {
  border-bottom: 1px solid #f3f4f6;
}

.pattern-option:last-child {
  border-bottom: none;
}

.pattern-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
}

.icon-daily { background: linear-gradient(135deg, #f59e0b, #f97316); }
.icon-weekly { background: linear-gradient(135deg, #10b981, #059669); }
.icon-custom { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.pattern-badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
}

.badge-daily { background: #fff7ed; color: #f97316; }
.badge-weekly { background: #ecfdf5; color: #059669; }
.badge-custom { background: #f3e8ff; color: #7c3aed; }

.multiselect-footer {
  background: #eef2ff;
  color: #4338ca;
  font-weight: 500;
}

/* دکمه‌ها */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.custom-success-btn {
  background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
  border: none !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 600;
}

.custom-success-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
}
/* محدود کردن ارتفاع چیپ‌ها و جلوگیری از کش آمدن صفحه در موبایل */
.enhanced-multiselect :deep(.p-multiselect-trigger) {
  min-height: 44px; /* حداقل ارتفاع مناسب برای تاچ */
}

.enhanced-multiselect :deep(.p-multiselect-label) {
  padding: 0.75rem 1rem;
  line-height: 1.4;
  max-height: 300px;           /* حداکثر ارتفاع ثابت برای قسمت چیپ‌ها */
  overflow: hidden;           /* اگر چیپ‌ها زیاد شدن، مخفی بشن */
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

/* اگر بخوای چیپ‌ها در چند خط بمونن ولی ارتفاع کلی محدود باشه */
.enhanced-multiselect :deep(.p-multiselect-token) {
  margin: 0.25rem 0;
}

/* نسخه بهتر: وقتی تعداد زیاد شد، به جای چند خط، یک متن خلاصه نشون بده */
.enhanced-multiselect :deep(.p-multiselect-items-label) {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>