<!-- src/views/Goals/TaskPattern.vue -->
<template>
  <div class="pattern-list-page">
    <!-- جدول لیست تسک پترن‌ها -->
    <Table
        :data="patternsData"
        :columns="tableColumns"
        title="لیست الگوهای تکرار تسک"
        :loading="loading"
        :actions="['edit', 'delete']"
        @edit="openEditModal"
        @delete="openDeleteModal"
        @open-create-modal="openCreateModal"
    />

    <!-- مودال افزودن / ویرایش الگو -->
    <Dialog
        v-model:visible="showEditModal"
        :header="isEditMode ? 'ویرایش الگو' : 'ایجاد الگوی جدید'"
        :modal="true"
        :closable="true"
        :style="{ width: '50vw' }"
        :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
    >
      <form @submit.prevent="submitPatternForm" class="pattern-form space-y-6">
        <!-- نام الگو -->
        <div class="field">
          <label class="field-label">
            نام الگو <span class="required">*</span>
          </label>
          <InputText
              v-model="form.name"
              placeholder="مثال: مطالعه روزانه"
              class="input-field"
              :class="{ 'input-error': v$.name.$error }"
          />
          <small v-if="v$.name.$error" class="error-message">
            {{ v$.name.$errors[0].$message }}
          </small>
        </div>

        <!-- پیش‌تنظیم‌های سریع -->
        <div class="field">
          <label class="field-label">الگوهای آماده (اختیاری)</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
                type="button"
                v-for="preset in presets"
                :key="preset.id"
                @click="applyPreset(preset)"
                class="preset-btn"
                :class="{ 'preset-active': isPresetActive(preset) }"
            >
              <i :class="preset.icon" class="ml-2"></i>
              {{ preset.label }}
            </button>
          </div>
          <small class="hint-text">یکی را انتخاب کنید یا به صورت دستی تنظیم کنید</small>
        </div>

        <!-- نوع تکرار -->
        <div class="field">
          <label class="field-label">نوع تکرار <span class="required">*</span></label>
          <Dropdown
              v-model="form.pattern_type"
              :options="patternTypes"
              optionLabel="label"
              optionValue="value"
              :loading="typesLoading"
              placeholder="انتخاب نوع تکرار"
              class="input-field"
              :class="{ 'input-error': v$.pattern_type.$error }"
              @change="onTypeChange"
          />
          <small v-if="v$.pattern_type.$error" class="error-message">
            {{ v$.pattern_type.$errors[0].$message }}
          </small>
        </div>

        <!-- تنظیمات شرطی بر اساس نوع -->
        <div v-if="form.pattern_type" class="conditional-fields space-y-6">

          <!-- DAILY -->
          <div v-if="form.pattern_type === 'daily'">
            <label class="field-label">هر چند روز یکبار؟ <span class="required">*</span></label>
            <div class="flex flex-wrap gap-3 mb-4">
              <Button
                  v-for="n in [1, 2, 3, 5, 7, 10]"
                  :key="n"
                  type="button"
                  :label="n === 1 ? 'هر روز' : `هر ${n} روز یکبار`"
                  @click="form.interval_days = n"
                  :outlined="form.interval_days !== n"
                  class="flex-1 min-w-[120px]"
              />
            </div>
            <InputNumber
                v-model="form.interval_days"
                :min="1"
                placeholder="عدد دلخواه"
                class="w-full"
                showButtons
                buttonLayout="horizontal"
            />
          </div>

          <!-- WEEKLY -->
          <div v-if="form.pattern_type === 'weekly'">
            <label class="field-label">در کدام روزها؟ <span class="required">*</span></label>
            <div class="grid grid-cols-4 md:grid-cols-7 gap-3 mb-4">
              <Button
                  v-for="day in weekDays"
                  :key="day.value"
                  type="button"
                  :label="day.short"
                  @click="toggleDay(day.value)"
                  :outlined="!isDaySelected(day.value)"
                  class="text-sm"
              />
            </div>
            <div class="flex gap-3">
              <Button label="روزهای فرد ماه" @click="selectOddEven('Odd')" outlined class="p-button-info" />
              <Button label="روزهای زوج ماه" @click="selectOddEven('Even')" outlined class="p-button-info" />
              <Button label="پاک کردن" @click="form.days_of_week = []" severity="secondary" outlined />
            </div>
          </div>

          <!-- MONTHLY -->
          <div v-if="form.pattern_type === 'monthly'">
            <label class="field-label">در روز چندم ماه؟ <span class="required">*</span></label>
            <InputNumber
                v-model="form.month_day"
                :min="1"
                :max="31"
                placeholder="مثال: ۱۵"
                class="w-full"
                showButtons
            />
          </div>

          <!-- YEARLY -->
          <div v-if="form.pattern_type === 'yearly'">
            <label class="field-label">در کدام ماه‌ها؟ <span class="required">*</span></label>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
              <Button
                  v-for="month in monthsList"
                  :key="month.value"
                  type="button"
                  :label="month.label"
                  @click="toggleMonth(month.value)"
                  :outlined="!isMonthSelected(month.value)"
                  class="text-xs"
              />
            </div>

            <label class="field-label">در روز چندم ماه؟ <span class="required">*</span></label>
            <InputNumber
                v-model="form.month_day"
                :min="1"
                :max="31"
                placeholder="مثال: ۱"
                class="w-full"
                showButtons
            />
          </div>

          <!-- CUSTOM -->
          <div v-if="form.pattern_type === 'custom'" class="bg-amber-50 p-5 rounded-xl">
            <p class="text-amber-900 font-semibold mb-3">
              <i class="pi pi-cog mr-2"></i>
              الگوی سفارشی: می‌توانید ترکیبی از تنظیمات بالا را استفاده کنید
            </p>
            <small class="text-amber-700">در این حالت تمام فیلدها قابل پر کردن هستند.</small>
          </div>
        </div>

        <!-- توضیحات -->
        <div class="field">
          <label class="field-label">توضیحات (اختیاری)</label>
          <Textarea
              v-model="form.description"
              rows="4"
              placeholder="توضیح بیشتری درباره این الگو..."
              class="input-field"
          />
        </div>

        <!-- دکمه‌های فرم -->
        <div class="form-actions">
          <Button
              type="button"
              label="انصراف"
              class="p-button-secondary p-button-outlined"
              @click="showEditModal = false"
          />
          <Button
              type="submit"
              :label="isEditMode ? 'ذخیره تغییرات' : 'ایجاد الگو'"
              class="p-button-success custom-success-btn"
              :loading="isSubmitting"
          />
        </div>
      </form>
    </Dialog>

    <!-- مودال تایید حذف -->
    <ConfirmDelete
        v-model:visible="showDeleteModal"
        :item-name="selectedPatternForDelete?.name || ''"
        @confirm="deletePattern"
        @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'

import Table from '@/components/table/Table.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import ConfirmDelete from '@/components/ConfirmDelete.vue'

import { useToast } from '@/composables/useToast.js'
import {
  useTaskPatterns,
  useCreateTaskPattern,
  useUpdateTaskPattern,
  useDeleteTaskPattern,
  useTaskPatternTypes
} from '@/composables/useTaskPattern.js'

const { showSuccess, showError } = useToast()

// داده‌های لیست
const { data: patternsDataRaw, isLoading: loading, refetch } = useTaskPatterns()
const patternsData = computed(() => patternsDataRaw.value || [])

// انواع پترن از API
const { data: patternTypesRaw, isLoading: typesLoading } = useTaskPatternTypes()
const patternTypes = computed(() => {
  return patternTypesRaw.value?.map(item => ({ label: item.label, value: item.value })) || []
})

// ستون‌های جدول (نمایش label فارسی برای نوع)
const tableColumns = [
  { field: 'name', header: 'نام الگو', sortable: true },
  {
    field: 'pattern_type',
    header: 'نوع',
    sortable: true,
    body: (row) => {
      const type = patternTypes.value.find(t => t.value === row.pattern_type)
      return type ? type.label : row.pattern_type || '-'
    }
  },
  { field: 'description', header: 'توضیحات' },
]

// پیش‌تنظیم‌های آماده
const presets = [
  { id: 'daily1', label: 'هر روز', icon: 'pi pi-sun', pattern_type: 'daily', interval_days: 1 },
  { id: 'daily2', label: 'دو روز در میان', icon: 'pi pi-refresh', pattern_type: 'daily', interval_days: 2 },
  { id: 'daily3', label: 'سه روز در میان', icon: 'pi pi-sync', pattern_type: 'daily', interval_days: 3 },
  { id: 'weekly-odd', label: 'روزهای فرد ماه', icon: 'pi pi-circle', pattern_type: 'weekly', days_of_week: ['Odd'] },
  { id: 'weekly-even', label: 'روزهای زوج ماه', icon: 'pi pi-circle-off', pattern_type: 'weekly', days_of_week: ['Even'] },
  { id: 'monthly1', label: 'اول هر ماه', icon: 'pi pi-calendar-plus', pattern_type: 'monthly', month_day: 1 },
  { id: 'monthly15', label: 'پانزدهم هر ماه', icon: 'pi pi-calendar', pattern_type: 'monthly', month_day: 15 },
]

// روزهای هفته
const weekDays = [
  { value: 'Monday', short: 'دوشنبه' },
  { value: 'Tuesday', short: 'سه‌شنبه' },
  { value: 'Wednesday', short: 'چهارشنبه' },
  { value: 'Thursday', short: 'پنج‌شنبه' },
  { value: 'Friday', short: 'جمعه' },
  { value: 'Saturday', short: 'شنبه' },
  { value: 'Sunday', short: 'یکشنبه' },
]

// ماه‌های شمسی (برای YEARLY)
const monthsList = [
  { value: 1, label: 'فروردین' },
  { value: 2, label: 'اردیبهشت' },
  { value: 3, label: 'خرداد' },
  { value: 4, label: 'تیر' },
  { value: 5, label: 'مرداد' },
  { value: 6, label: 'شهریور' },
  { value: 7, label: 'مهر' },
  { value: 8, label: 'آبان' },
  { value: 9, label: 'آذر' },
  { value: 10, label: 'دی' },
  { value: 11, label: 'بهمن' },
  { value: 12, label: 'اسفند' },
]

// فرم و وضعیت
const showEditModal = ref(false)
const isEditMode = ref(false)
const selectedPattern = ref(null)

const form = ref({
  name: '',
  pattern_type: null,
  interval_days: null,
  days_of_week: [],
  month_day: null,
  months: [],
  description: ''
})

// اعتبارسنجی پایه
const rules = computed(() => ({
  name: { required: helpers.withMessage('نام الگو الزامی است', required) },
  pattern_type: { required: helpers.withMessage('نوع تکرار الزامی است', required) },
}))
const v$ = useVuelidate(rules, form)

// توابع پیش‌تنظیم
const applyPreset = (preset) => {
  form.value.pattern_type = preset.pattern_type
  form.value.interval_days = preset.interval_days || null
  form.value.days_of_week = preset.days_of_week || []
  form.value.month_day = preset.month_day || null
  form.value.months = preset.months || []
}

const isPresetActive = (preset) => {
  if (form.value.pattern_type !== preset.pattern_type) return false
  if (preset.interval_days && form.value.interval_days !== preset.interval_days) return false
  if (preset.days_of_week && JSON.stringify(form.value.days_of_week) !== JSON.stringify(preset.days_of_week)) return false
  if (preset.month_day && form.value.month_day !== preset.month_day) return false
  return true
}

// توابع کمکی برای WEEKLY و YEARLY
const toggleDay = (day) => {
  if (!form.value.days_of_week) form.value.days_of_week = []
  const idx = form.value.days_of_week.indexOf(day)
  if (idx > -1) form.value.days_of_week.splice(idx, 1)
  else form.value.days_of_week.push(day)
}

const selectOddEven = (type) => {
  form.value.days_of_week = [type]
}

const isDaySelected = (day) => form.value.days_of_week?.includes(day)

const toggleMonth = (month) => {
  if (!form.value.months) form.value.months = []
  const idx = form.value.months.indexOf(month)
  if (idx > -1) form.value.months.splice(idx, 1)
  else form.value.months.push(month)
}

const isMonthSelected = (month) => form.value.months?.includes(month)

// وقتی نوع تغییر کرد، فیلدهای غیرمرتبط رو پاک کن
const onTypeChange = () => {
  form.value.interval_days = null
  form.value.days_of_week = []
  form.value.month_day = null
  form.value.months = []
}

// باز کردن مودال‌ها
const openCreateModal = () => {
  isEditMode.value = false
  selectedPattern.value = null
  resetForm()
  showEditModal.value = true
}

const openEditModal = (pattern) => {
  isEditMode.value = true
  selectedPattern.value = pattern
  form.value = {
    name: pattern.name || '',
    pattern_type: pattern.pattern_type || null,
    interval_days: pattern.interval_days || null,
    days_of_week: pattern.days_of_week || [],
    month_day: pattern.month_day || null,
    months: pattern.months || [],
    description: pattern.description || ''
  }
  showEditModal.value = true
}

const resetForm = () => {
  form.value = {
    name: '',
    pattern_type: null,
    interval_days: null,
    days_of_week: [],
    month_day: null,
    months: [],
    description: ''
  }
  v$.value.$reset()
}

watch(showEditModal, (val) => {
  if (!val) {
    resetForm()
    isEditMode.value = false
    selectedPattern.value = null
  }
})

// ارسال فرم
const createMutation = useCreateTaskPattern()
const updateMutation = useUpdateTaskPattern()
const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

const submitPatternForm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  // پاک کردن فیلدهای null خالی (برای جلوگیری از خطای clean در بک‌اند)
  const payload = {
    name: form.value.name.trim(),
    pattern_type: form.value.pattern_type,
    description: form.value.description?.trim() || null,
    interval_days: form.value.interval_days || null,
    days_of_week: form.value.days_of_week.length ? form.value.days_of_week : null,
    month_day: form.value.month_day || null,
    months: form.value.months.length ? form.value.months : null,
  }

  try {
    if (isEditMode.value) {
      await updateMutation.mutateAsync({ id: selectedPattern.value.id, updates: payload })
      showSuccess('الگو با موفقیت ویرایش شد!')
    } else {
      await createMutation.mutateAsync(payload)
      showSuccess('الگوی جدید با موفقیت ایجاد شد!')
    }
    refetch()
    showEditModal.value = false
  } catch (error) {
    console.error(error)
    showError('خطایی در ذخیره الگو رخ داد. لطفاً دوباره تلاش کنید.')
  }
}

// حذف
const showDeleteModal = ref(false)
const selectedPatternForDelete = ref(null)
const openDeleteModal = (pattern) => {
  selectedPatternForDelete.value = pattern
  showDeleteModal.value = true
}

const deleteMutation = useDeleteTaskPattern()
const deletePattern = async () => {
  try {
    await deleteMutation.mutateAsync(selectedPatternForDelete.value.id)
    showSuccess('الگو با موفقیت حذف شد!')
    refetch()
  } catch (error) {
    showError('خطا در حذف الگو')
  } finally {
    showDeleteModal.value = false
    selectedPatternForDelete.value = null
  }
}
</script>

<style scoped>
.pattern-list-page {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #1f2937;
}

.required {
  color: #ef4444;
}

.input-field {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
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

.preset-btn {
  @apply px-4 py-3 rounded-xl border transition flex items-center justify-center text-sm font-medium;
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #475569;
}

.preset-btn:hover {
  background: #e0e7ff;
  border-color: #6366f1;
}

.preset-active {
  background: #6366f1 !important;
  color: white !important;
  border-color: #6366f1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.custom-success-btn {
  background: linear-gradient(to right, #6366f1, #8b5cf6) !important;
  border: none !important;
}
</style>