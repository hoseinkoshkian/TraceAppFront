<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-400 px-4 py-12 sm:py-16 md:py-20">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300">

      <!-- App Title -->
      <h1 class="text-3xl font-bold text-center text-indigo-600 mb-2">
        هدف من
      </h1>
      <p class="text-center text-gray-500 mb-8 text-sm">
        مدیریت هوشمند اهداف شخصی
      </p>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <BaseInput
            v-model="form.phone_number"
            label="شماره تماس یا نام کاربری"
            placeholder="۰۹۱۳۱۲۳۱۲۳۱"
            type="text"
            required
            @validity="phoneValid = $event"
        />

        <BaseInput
            v-model="form.password"
            label="رمز عبور"
            placeholder="••••••••"
            type="password"
            required
            @validity="passwordValid = $event"
        />

        <!-- Submit Button -->
        <button
            type="submit"
            class="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 disabled:opacity-70"
            :disabled="loginMutation.isPending.value"
        >
          <span v-if="loginMutation.isPending.value">
            در حال ورود...
          </span>
          <span v-else>
            ورود
          </span>
        </button>

      </form>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500 mt-8">
        حساب کاربری ندارید؟
        <span class="text-indigo-600 cursor-pointer hover:underline font-medium">
          ثبت‌نام
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useLogin } from '../../composables/auth/useAuth.js'
import router from "@/router/index.js";
import BaseInput from "@/components/base/BaseInput.vue";
import {useToast} from '@/composables/useToast.js';
const { showSuccess, showError } = useToast()

const form = reactive({
  phone_number: '',
  password: ''
})

// تعریف متغیرهای اعتبارسنجی
const phoneValid = ref(false)
const passwordValid = ref(false)

const loginMutation = useLogin(router)

const handleSubmit = () => {
  if (!phoneValid.value || !passwordValid.value) {
    showError('لطفاً فیلدهای الزامی را پر کنید')
    return
  }

  loginMutation.mutate({
    phone_number: form.phone_number,
    password: form.password
  })
}
</script>

<style scoped>
/* کمی انیمیشن نرم‌تر */
</style>
