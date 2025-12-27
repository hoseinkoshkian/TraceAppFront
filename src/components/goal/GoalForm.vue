<template>
  <form @submit.prevent="submitForm" class="goal-form">
    <div class="form-grid">
      <!-- عنوان هدف -->
      <div class="field">
        <label class="field-label">
          عنوان هدف <span class="required">*</span>
        </label>
        <InputText
            v-model="form.title"
            :class="{ 'p-invalid': v$.title.$error }"
            placeholder="مثال: یادگیری Vue 3 به طور کامل"
            class="w-full"
            dir="rtl"
        />
        <small v-if="v$.title.$error" class="p-error">
          {{ v$.title.$errors[0].$message }}
        </small>
      </div>

      <!-- والد اختیاری -->
      <div class="field col-span-2">
        <label class="field-label">هدف والد (اختیاری)</label>
        <AutoComplete
            v-model="selectedParent"
            :suggestions="parentOptions"
            optionLabel="title"
            placeholder="جستجو بین اهداف..."
            class="w-full"
            :forceSelection="true"
            @complete="searchParents"
        />
      </div>

      <!-- تاریخ شروع -->
      <div class="field">
        <label class="field-label">
          تاریخ شروع <span class="required">*</span>
        </label>
        <date-picker
            v-model="jalaliDate"
            format="jYYYY/jMM/jDD"
            display-format="jYYYY/jMM/jDD"
            input-class="w-full rounded-lg border px-3 py-2 text-center"
            :class="{ 'p-invalid': v$.jalaliDate.$error }"
        />
        <small v-if="v$.jalaliDate.$error" class="p-error">
          تاریخ شروع الزامی است
        </small>
      </div>

      <!-- توضیحات -->
      <div class="field col-span-2">
        <label class="field-label">توضیحات</label>
        <Textarea
            v-model="form.description"
            rows="5"
            placeholder="توضیحات بیشتر درباره هدف خود بنویسید..."
            class="w-full"
            dir="rtl"
        />
      </div>
    </div>

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

import { useCreateGoal, useUpdateGoal, useGoals } from '@/composables/useGoal.js'

// Props & Emits
const props = defineProps({initialData: {type: Object, default: () => ({})}})
const emit = defineEmits(['success', 'cancel'])

// State
const form = ref({title: '', description: ''})
const jalaliDate = ref(null)
const selectedParent = ref(null)

// Mutations
const createMutation = useCreateGoal()
const updateMutation = useUpdateGoal()
const isEditMode = computed(() => !!props.initialData?.id)
const isSubmitting = computed(() => createMutation.isPending.value || updateMutation.isPending.value)

// Validation
const rules = {
  title: {
    required: helpers.withMessage('عنوان هدف الزامی است', required),
    minLength: helpers.withMessage('عنوان باید حداقل ۳ کاراکتر باشد', minLength(3))
  },
  jalaliDate: {
    required: helpers.withMessage('تاریخ شروع الزامی است', required)
  }
}
const state = computed(() => ({title: form.value.title, jalaliDate: jalaliDate.value}))
const v$ = useVuelidate(rules, state)

// ------------------- Autocomplete والد -------------------
const parentSearch = ref('')
const {data: goalsData} = useGoals(parentSearch)
const parentOptions = ref([])

watch(goalsData, (val) => {
  parentOptions.value = val || []
})

const searchParents = (event) => {
  parentSearch.value = event.query || ''
}

console.log(props.initialData)
watch(() => props.initialData, (val) => {
  if (val?.id) {
    form.value.title = val.title || ''
    form.value.description = val.description || ''

    // درست کردن Moment معتبر برای date-picker
    jalaliDate.value = val.dateForTable

    selectedParent.value = val.parent
        ? { id: val.parent, title: val.parent_title || 'هدف والد' }
        : null
  } else {
    form.value.title = ''
    form.value.description = ''
    jalaliDate.value = null
    selectedParent.value = null
    parentOptions.value = []
    v$.value.$reset()
  }
}, { immediate: true })
console.log('hy hyh y')
console.log(jalaliDate.value)
// ------------------- Prepare Payload -------------------
const preparePayload = () => {
  const payload = { title: form.value.title.trim() }
  if (form.value.description?.trim()) payload.description = form.value.description.trim()
  if (jalaliDate.value) payload.start_datetime = jalaliDate.value.clone().utc().format() // ISO UTC
  if (selectedParent.value) payload.parent = selectedParent.value.id
  return payload
}

// ------------------- Submit -------------------
const submitForm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  try {
    if (isEditMode.value) {
      await updateMutation.mutateAsync({id: props.initialData.id, updates: preparePayload()})
    } else {
      await createMutation.mutateAsync(preparePayload())
    }
    emit('success')
  } catch (error) {
    console.error('خطا در ذخیره هدف:', error)
    alert('خطایی رخ داد. لطفاً دوباره تلاش کنید.')
  }
}
</script>

<style scoped>
.goal-form {
  direction: rtl;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

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

.col-span-2 {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.p-error {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>
