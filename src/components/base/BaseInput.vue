<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm text-gray-700 mb-1 font-medium">{{ label }}</label>

    <!-- Input -->
    <InputText
        :value="displayValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['w-full rounded-xl px-4 py-3 border focus:outline-none transition', hasError ? 'border-red-500 focus:ring-2 focus:ring-red-300' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500']"
        @input="onInput"
        @blur="validate"
    />

    <!-- Error message -->
    <p v-if="hasError" class="mt-1 text-xs text-red-700 bg-red-100 rounded px-2 py-1 inline-flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import {ref, computed, watch, defineProps, defineEmits} from 'vue'
import InputText from 'primevue/inputtext'

const props = defineProps({
  modelValue: [String, Number],
  placeholder: {type: String, default: ''},
  type: {type: String, default: 'text'},
  label: {type: String, default: ''},
  disabled: {type: Boolean, default: false},
  required: {type: Boolean, default: false},
  errorMessage: {type: String, default: 'این فیلد الزامی است'}
})

const emit = defineEmits(['update:modelValue', 'validity'])

// internal state برای ذخیره مقدار انگلیسی
const internalValue = ref(props.modelValue ?? '')

// خطا
const hasError = ref(false)

// مقدار نمایشی فارسی داخل input
const displayValue = computed(() => toPersianNumbers(internalValue.value))

// تبدیل اعداد فارسی به انگلیسی برای ذخیره
function toEnglishNumbers(str) {
  if (!str) return ''
  return str.replace(/[۰-۹]/g, w => String.fromCharCode(w.charCodeAt(0) - 1728))
}

// تبدیل اعداد انگلیسی به فارسی برای نمایش
function toPersianNumbers(str) {
  if (!str) return ''
  return str.replace(/\d/g, d => String.fromCharCode(d.charCodeAt(0) + 1728))
}

// کنترل تغییر کاربر
function onInput(e) {
  const persianValue = e.target.value
  internalValue.value = toEnglishNumbers(persianValue) // ذخیره انگلیسی
  emit('update:modelValue', internalValue.value)

  // بررسی دوباره خطا هنگام تایپ
  if (hasError.value) validate()
}

// اعتبارسنجی required
function validate() {
  if (props.required && !internalValue.value) {
    hasError.value = true
    emit('validity', false)
  } else {
    hasError.value = false
    emit('validity', true)
  }
}

// اگر props تغییر کرد، internalValue به روز شود
watch(() => props.modelValue, (newVal) => {
  internalValue.value = newVal
})
</script>

<style scoped>
/* اضافه کردن transition نرم برای focus و خطا */
input {
  transition: all 0.2s ease-in-out;
}
</style>
