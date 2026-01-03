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

    <!-- بخش تسک پترن‌ها -->
    <div class="task-patterns-section">
      <h3 class="section-title">
        <i class="pi pi-list mr-2"></i>
        تسک پترن‌ها
      </h3>
      <p class="section-subtitle">
        الگوهای تکرارشونده برای ایجاد تسک‌های خودکار (مثل مطالعه روزانه یا تمرین هفتگی)
      </p>

      <div class="relative">
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
            append-to="self"
            :loading="isLoadingPatterns"
        >
          <!-- گزینه‌ها -->
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

          <!-- چیپ‌ها -->
          <template #chip="{ value }">
            <div class="pattern-chip inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              <i :class="getPatternIcon(findPatternById(value)?.pattern_type || 'daily')"></i>
              <span class="font-medium">{{ findPatternById(value)?.name || 'در حال بارگذاری...' }}</span>
              <span :class="['text-xs px-2 py-0.5 rounded', `badge-${findPatternById(value)?.pattern_type || 'daily'}`]">
                {{ patternTypeLabel(findPatternById(value)?.pattern_type || 'daily') }}
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
      </div>

      <small class="hint-text block mt-3">
        می‌توانید چندین پترن را همزمان انتخاب کنید تا تسک‌های تکرارشونده به صورت خودکار ساخته شوند.
      </small>
    </div>

    <!-- دکمه‌ها -->
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

import { useToast } from '@/composables/useToast.js'
const { showSuccess, showError } = useToast()

import { useCreateGoal, useUpdateGoal, useGoals } from '@/composables/useGoal.js'
import { useTaskPatterns } from '@/composables/useTaskPattern.js'
import {
  useCreateGoalTaskPattern,
  useDeleteGoalTaskPattern,
  useGoalTaskPatterns
} from '@/composables/useGoalTaskPattern.js'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['success', 'cancel'])

// فرم اصلی
const form = ref({ title: '', description: '' })
const jalaliDate = ref(null)
const jalaliEndDate = ref(null)
const selectedParent = ref(null)

// همه تسک پترن‌ها (برای مولتی‌سلکت)
const { data: allTaskPatternsRaw, isLoading: isLoadingPatterns } = useTaskPatterns()

// ایمن‌سازی: همیشه آرایه باشه حتی قبل از لود شدن داده
const allTaskPatterns = computed(() => allTaskPatternsRaw.value ?? [])

// تابع جستجو در پترن‌ها — کاملاً ایمن
const findPatternById = (id) => {
  if (!id) return null
  return allTaskPatterns.value.find(p => p.id === id) || null
}

// پترن‌های متصل به هدف فعلی (در حالت ویرایش)
const currentGoalId = computed(() => props.initialData?.id || null)

const { data: attachedRelationsRaw } = useGoalTaskPatterns(currentGoalId)
// ایمن‌سازی روابط
const attachedRelations = computed(() => attachedRelationsRaw.value ?? [])
console.log('data is : ' , attachedRelations)

// پترن‌های انتخاب‌شده توسط کاربر (آرایه‌ای از idهای task_pattern)
const selectedTaskPatterns = ref([])

// پر کردن مولتی‌سلکت در حالت ویرایش
watch(attachedRelations, (relations) => {
  selectedTaskPatterns.value = relations.map(rel => rel.pattern.id) // اگر فیلد task_pattern_id بود، اینجا تغییر بده
}, { immediate: true })

// توابع کمکی برای تمپلیت
const patternTypeLabel = (type) => {
  const labels = { daily: 'روزانه', weekly: 'هفتگی', custom: 'سفارشی' }
  return labels[type] || 'نامشخص'
}

const getPatternIcon = (type) => {
  const icons = { daily: 'pi pi-sun', weekly: 'pi pi-calendar', custom: 'pi pi-cog' }
  return icons[type] || 'pi pi-circle'
}

// mutationهای هدف
const createGoalMutation = useCreateGoal()
const updateGoalMutation = useUpdateGoal()

// mutationهای رابطه Goal ↔ TaskPattern
const createRelationMutation = useCreateGoalTaskPattern()
const deleteRelationMutation = useDeleteGoalTaskPattern()

const isEditMode = computed(() => !!props.initialData?.id)

const isSubmitting = computed(() => {
  return (
      createGoalMutation.isPending.value ||
      updateGoalMutation.isPending.value ||
      createRelationMutation.isPending.value ||
      deleteRelationMutation.isPending.value
  )
})

// Validation
const rules = {
  title: {
    required: helpers.withMessage('عنوان هدف الزامی است', required),
    minLength: helpers.withMessage('عنوان باید حداقل ۳ کاراکتر باشد', minLength(3))
  },
  jalaliDate: { required: helpers.withMessage('تاریخ شروع الزامی است', required) }
}
const state = computed(() => ({ title: form.value.title, jalaliDate: jalaliDate.value }))
const v$ = useVuelidate(rules, state)

// جستجوی هدف والد
const parentSearch = ref('')
const { data: goalsData = [] } = useGoals(parentSearch)
const parentOptions = ref([])
watch(goalsData, (val) => { parentOptions.value = val || [] })

const searchParents = (event) => {
  parentSearch.value = event.query || ''
}

// پر کردن فرم در حالت ویرایش یا ایجاد جدید
watch(() => props.initialData, (val) => {
  if (val?.id) {
    form.value.title = val.title || ''
    form.value.description = val.description || ''
    jalaliDate.value = val.dateForTable || null
    jalaliEndDate.value = val.endDateForTable || null
    selectedParent.value = val.parent ? { id: val.parent, title: val.parent_title || 'هدف والد' } : null
    // selectedTaskPatterns توسط watch(attachedRelations) پر می‌شه
  } else {
    form.value = { title: '', description: '' }
    jalaliDate.value = null
    jalaliEndDate.value = null
    selectedParent.value = null
    selectedTaskPatterns.value = []
    v$.value.$reset()
  }
}, { immediate: true })

// payload فقط برای هدف (بدون task_patterns)
const prepareGoalPayload = () => {
  const payload = { title: form.value.title.trim() }
  if (form.value.description?.trim()) payload.description = form.value.description.trim()
  if (jalaliDate.value) payload.start_datetime = moment(jalaliDate.value, 'jYYYY/jMM/jDD').utc().format()
  if (jalaliEndDate.value) payload.end_datetime = moment(jalaliEndDate.value, 'jYYYY/jMM/jDD').utc().format()
  if (selectedParent.value?.id) payload.parent = selectedParent.value.id
  return payload
}

// همگام‌سازی روابط تسک پترن‌ها بعد از ذخیره هدف
const syncTaskPatternRelations = async (goalId) => {
  const currentRelations = attachedRelations.value
  const currentIds = new Set(currentRelations.map(rel => rel.task_pattern))
  const selectedIds = new Set(selectedTaskPatterns.value)

  const toAdd = [...selectedIds].filter(id => !currentIds.has(id))
  const toRemove = [...currentIds].filter(id => !selectedIds.has(id))

  const promises = []

  // اضافه کردن روابط جدید
  toAdd.forEach(taskPatternId => {
    promises.push(createRelationMutation.mutateAsync({
      goal: goalId,
      pattern: taskPatternId
    }))
  })

  // حذف روابط قدیمی
  toRemove.forEach(taskPatternId => {
    const relation = currentRelations.find(rel => rel.task_pattern === taskPatternId)
    if (relation?.id) {
      promises.push(deleteRelationMutation.mutateAsync(relation.id))
    }
  })

  if (promises.length > 0) {
    await Promise.all(promises)
  }
}

// submit نهایی
const submitForm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    let goalId = props.initialData?.id

    if (isEditMode.value) {
      await updateGoalMutation.mutateAsync({
        id: goalId,
        updates: prepareGoalPayload()
      })
      showSuccess('هدف با موفقیت ویرایش شد!')
    } else {
      const response = await createGoalMutation.mutateAsync(prepareGoalPayload())
      // تنظیم بر اساس ساختار پاسخ API شما
      goalId = response.data?.id || response.data?.goal?.id || response.data
      showSuccess('هدف با موفقیت ایجاد شد!')
    }

    // همگام‌سازی روابط تسک پترن‌ها
    await syncTaskPatternRelations(goalId)

    emit('success')
  } catch (error) {
    console.error('خطا در ذخیره هدف یا روابط تسک پترن:', error)
    showError('خطایی رخ داد. لطفاً دوباره تلاش کنید.')
  }
}
</script>

<style scoped>
/* تمام استایل‌های قبلی بدون تغییر */
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

.enhanced-multiselect :deep(.p-multiselect-trigger) {
  min-height: 44px;
}

.enhanced-multiselect :deep(.p-multiselect-label) {
  padding: 0.75rem 1rem;
  line-height: 1.4;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.enhanced-multiselect :deep(.p-multiselect-token) {
  margin: 0.25rem 0;
}
</style>