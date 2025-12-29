<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 px-4 relative overflow-hidden">
    <!-- پس‌زمینه انیمیشن‌دار با شکل‌های نرم -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div class="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-400 opacity-20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    </div>

    <div class="relative w-full max-w-md bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">

      <!-- لوگو و عنوان -->
      <div class="text-center mb-10">
        <!-- می‌تونی یه SVG آیکون هدف یا لوگو اینجا بذاری -->
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          هدف من
        </h1>
        <p class="text-gray-600 mt-2 text-lg">
          مدیریت هوشمند اهداف شخصی
        </p>
      </div>

      <!-- فرم ورود -->
      <form @submit.prevent="login" class="space-y-6">

        <!-- نام کاربری یا ایمیل -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            نام کاربری یا ایمیل
          </label>
          <div class="relative">
            <input
                v-model="form.username"
                type="text"
                placeholder="example@email.com"
                class="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-300 bg-white/60 focus:bg-white focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none transition-all duration-300 shadow-sm"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <!-- رمز عبور -->
        <div class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            رمز عبور
          </label>
          <div class="relative">
            <input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                class="w-full px-5 py-4 pr-12 rounded-2xl border border-gray-300 bg-white/60 focus:bg-white focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 focus:outline-none transition-all duration-300 shadow-sm"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <!-- دکمه ورود -->
        <button
            type="submit"
            class="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          ورود
        </button>

      </form>

      <!-- لینک ثبت‌نام -->
      <div class="text-center mt-8">
        <p class="text-gray-600">
          حساب کاربری ندارید؟
          <router-link to="/register" class="text-indigo-600 font-semibold hover:underline hover:text-purple-600 transition">
            ثبت‌نام کنید
          </router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: ''
})

const login = () => {
  console.log('Login Data:', form)
  // بعداً اینجا API رو وصل کن
}
</script>

<style scoped>
/* اگر نیاز به انیمیشن اضافی داشتی می‌تونی اینجا اضافه کنی */
</style>