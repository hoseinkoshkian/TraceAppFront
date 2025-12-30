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

        <!-- Username / Phone -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">
            نام کاربری یا ایمیل
          </label>
          <input
              v-model="form.phone_number"
              type="text"
              placeholder="example@email.com"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
              required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm text-gray-700 mb-1">
            رمز عبور
          </label>
          <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:outline-none transition"
              required
          />
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            class="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 disabled:opacity-70"

        >
          <span v-if="loginMutation.isPending.value ">
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
import { reactive } from 'vue'
import { useLogin } from '../../composables/auth/useAuth.js' // مسیر خودت رو چک کن

const form = reactive({
  phone_number: '',
  password: ''
})

const loginMutation = useLogin()

const handleSubmit = () => {
  loginMutation.mutate({
    phone_number: form.phone_number,
    password: form.password
  })
}
</script>

<style scoped>
/* اختیاری: اگر می‌خوای کمی انیمیشن نرم‌تر داشته باشه */
</style>